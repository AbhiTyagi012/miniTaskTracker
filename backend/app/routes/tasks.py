from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.models.task import TaskCreate, TaskOut, TaskStatus, TaskUpdate, task_from_doc

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_db() -> AsyncIOMotorDatabase:
    return get_database()


def validate_object_id(task_id: str) -> ObjectId:
    try:
        return ObjectId(task_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="Invalid task id")


@router.get("", response_model=List[TaskOut])
async def list_tasks(
    status: Optional[TaskStatus] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    query: dict = {}
    if status:
        query["status"] = status.value
    if search and search.strip():
        query["title"] = {"$regex": search.strip(), "$options": "i"}

    cursor = db["tasks"].find(query).sort("created_at", -1)
    tasks = await cursor.to_list(length=1000)
    return [task_from_doc(t) for t in tasks]


@router.post("", response_model=TaskOut, status_code=201)
async def create_task(
    payload: TaskCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    doc = {
        "title": payload.title,
        "description": payload.description or "",
        "status": TaskStatus.open.value,
        "priority": payload.priority.value if payload.priority else None,
        "due_date": payload.due_date,
        "created_at": now,
        "updated_at": now,
    }
    result = await db["tasks"].insert_one(doc)
    created = await db["tasks"].find_one({"_id": result.inserted_id})
    return task_from_doc(created)


@router.patch("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: str,
    payload: TaskUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    oid = validate_object_id(task_id)
    existing = await db["tasks"].find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")

    updates: dict = {"updated_at": datetime.now(timezone.utc)}
    if payload.title is not None:
        updates["title"] = payload.title
    if payload.description is not None:
        updates["description"] = payload.description
    if payload.status is not None:
        updates["status"] = payload.status.value
    if payload.priority is not None:
        updates["priority"] = payload.priority.value
    if payload.due_date is not None:
        updates["due_date"] = payload.due_date

    await db["tasks"].update_one({"_id": oid}, {"$set": updates})
    updated = await db["tasks"].find_one({"_id": oid})
    return task_from_doc(updated)


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    oid = validate_object_id(task_id)
    result = await db["tasks"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
