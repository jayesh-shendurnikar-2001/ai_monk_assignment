from sqlalchemy import Column, Integer, JSON
from database import Base

class Tree(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON)