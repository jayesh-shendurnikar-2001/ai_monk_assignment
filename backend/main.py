from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

import models, schemas, crud
from database import SessionLocal, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nested Tag Tree API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET all trees
@app.get("/trees", response_model=list[schemas.TreeResponse])
def get_all_trees(db: Session = Depends(get_db)):
    return crud.get_trees(db)


# CREATE tree
@app.post("/trees", response_model=schemas.TreeResponse)
def create_tree(tree: schemas.Tag, db: Session = Depends(get_db)):
    return crud.create_tree(db, tree)


# UPDATE tree
@app.put("/trees/{tree_id}", response_model=schemas.TreeResponse)
def update_tree(tree_id: int, tree: schemas.Tag, db: Session = Depends(get_db)):
    updated = crud.update_tree(db, tree_id, tree)

    if not updated:
        raise HTTPException(status_code=404, detail="Tree not found")

    return updated