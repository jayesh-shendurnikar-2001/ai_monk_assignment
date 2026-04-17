import { useState } from "react";
import { createNewChild } from "../utils/treeUtils";

const TagView = ({ node, updateNode, depth, path }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(node.name);

  const handleAddChild = () => {
    if (node.children?.length) {
      updateNode({
        ...node,
        children: [...node.children, createNewChild()]
      });
      return;
    }

    updateNode({
      ...node,
      data: undefined,
      children: [createNewChild()]
    });
  };

  const updateChild = (index, childNode) => {
    const nextChildren = [...(node.children ?? [])];
    nextChildren[index] = childNode;
    updateNode({ ...node, children: nextChildren });
  };

  const commitNameChange = () => {
    const trimmedName = draftName.trim();

    updateNode({
      ...node,
      name: trimmedName || node.name
    });
    setIsEditingName(false);
  };

  return (
    <article className="tag-block" style={{ marginLeft: depth === 0 ? 0 : 18 }}>
      <header className="tag-header">
        <button
          aria-label={collapsed ? "Expand tag" : "Collapse tag"}
          className="toggle-button"
          onClick={() => setCollapsed((currentValue) => !currentValue)}
          type="button"
        >
          {collapsed ? ">" : "v"}
        </button>

        {isEditingName ? (
          <input
            autoFocus
            className="name-input"
            onBlur={commitNameChange}
            onChange={(event) => setDraftName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitNameChange();
              }
            }}
            type="text"
            value={draftName}
          />
        ) : (
          <button
            className="name-button"
            onClick={() => {
              setDraftName(node.name);
              setIsEditingName(true);
            }}
            type="button"
          >
            {node.name}
          </button>
        )}

        <button className="add-child-button" onClick={handleAddChild} type="button">
          Add Child
        </button>
      </header>

      {!collapsed ? (
        <div className="tag-body">
          {node.data !== undefined && node.data !== null ? (
            <label className="data-row">
              <span>Data</span>
              <input
                className="data-input"
                onChange={(event) =>
                  updateNode({
                    ...node,
                    data: event.target.value
                  })
                }
                type="text"
                value={node.data}
              />
            </label>
          ) : null}

          {node.children?.length
            ? node.children.map((child, index) => (
                <TagView
                  depth={depth + 1}
                  key={`${path}-${index}-${child.name}`}
                  node={child}
                  path={`${path}-${index}`}
                  updateNode={(nextChild) => updateChild(index, nextChild)}
                />
              ))
            : null}
        </div>
      ) : null}
    </article>
  );
};

export default TagView;
