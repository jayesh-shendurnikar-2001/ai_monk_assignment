from sqlalchemy.orm import Session
import models, schemas


def get_trees(db: Session):
    return db.query(models.Tree).all()


def create_tree(db: Session, tree: schemas.Tag):
    new_tree = models.Tree(data=tree.dict())
    db.add(new_tree)
    db.commit()
    db.refresh(new_tree)
    return new_tree


def update_tree(db: Session, tree_id: int, tree: schemas.Tag):
    db_tree = db.query(models.Tree).filter(models.Tree.id == tree_id).first()

    if not db_tree:
        return None

    db_tree.data = tree.dict()
    db.commit()
    db.refresh(db_tree)
    return db_tree