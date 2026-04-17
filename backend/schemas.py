from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, model_validator


class Tag(BaseModel):
    name: str
    data: Optional[str] = None
    children: Optional[List["Tag"]] = None

    @model_validator(mode="after")
    def validate_tree_shape(self) -> "Tag":
        has_children = self.children is not None
        has_data = self.data is not None

        if has_children == has_data:
            raise ValueError("Each tag must contain either 'children' or 'data', but not both.")

        return self


class TreeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    data: Tag
