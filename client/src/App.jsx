import { useEffect, useEffectEvent, useState } from "react";
import "./App.css";
import TreeView from "./components/TreeView";
import { createTree, getTrees, updateTree } from "./services/api";
import { cleanTree, createDefaultTree, normalizeTree } from "./utils/treeUtils";

const createTreeRecord = (tree, id = null) => ({
  clientId: crypto.randomUUID(),
  id,
  tree: normalizeTree(tree),
  exportText: "",
  status: id ? "Loaded from database" : "Unsaved tree"
});

function App() {
  const [trees, setTrees] = useState([]);
  const [pageState, setPageState] = useState({
    loading: true,
    error: ""
  });

  const fetchTrees = useEffectEvent(async () => {
    setPageState({ loading: true, error: "" });

    try {
      const response = await getTrees();

      if (response.data.length === 0) {
        setTrees([createTreeRecord(createDefaultTree())]);
      } else {
        setTrees(response.data.map((tree) => createTreeRecord(tree.data, tree.id)));
      }
    } catch {
      setTrees([createTreeRecord(createDefaultTree())]);
      setPageState({
        loading: false,
        error: "Could not load saved trees, so a sample tree is shown for editing."
      });
      return;
    }

    setPageState({ loading: false, error: "" });
  });

  useEffect(() => {
    void fetchTrees();
  }, []);

  const updateTreeRecord = (clientId, updater) => {
    setTrees((currentTrees) =>
      currentTrees.map((record) =>
        record.clientId === clientId ? updater(record) : record
      )
    );
  };

  const handleTreeChange = (clientId, nextTree) => {
    updateTreeRecord(clientId, (record) => ({
      ...record,
      tree: normalizeTree(nextTree),
      status: record.id ? "Changes not yet exported" : "Unsaved tree"
    }));
  };

  const handleExport = async (clientId) => {
    const record = trees.find((tree) => tree.clientId === clientId);

    if (!record) {
      return;
    }

    const cleanedTree = cleanTree(record.tree);
    const exportText = JSON.stringify(cleanedTree, null, 2);

    updateTreeRecord(clientId, (currentRecord) => ({
      ...currentRecord,
      exportText,
      status: "Saving..."
    }));

    try {
      if (record.id) {
        await updateTree(record.id, cleanedTree);

        updateTreeRecord(clientId, (currentRecord) => ({
          ...currentRecord,
          exportText,
          status: "Updated in database"
        }));
      } else {
        const response = await createTree(cleanedTree);

        updateTreeRecord(clientId, (currentRecord) => ({
          ...currentRecord,
          id: response.data.id,
          exportText,
          status: "Saved to database"
        }));
      }
    } catch {
      updateTreeRecord(clientId, (currentRecord) => ({
        ...currentRecord,
        exportText,
        status: "Save failed. Check that the backend is running."
      }));
    }
  };

  const addNewTree = () => {
    setTrees((currentTrees) => [...currentTrees, createTreeRecord(createDefaultTree())]);
  };

  return (
    <main className="app-shell">
      <section className="app-panel">
        <div className="app-toolbar">
          <div>
            <p className="eyebrow">AIMonk Assignment</p>
            <h1>Nested Tags Tree</h1>
            <p className="subtitle">
              Recursive tag editing with add-child, collapse, rename, export, and
              database persistence.
            </p>
          </div>

          <button className="primary-button" onClick={addNewTree} type="button">
            Add New Tree
          </button>
        </div>

        {pageState.error ? <p className="banner warning">{pageState.error}</p> : null}
        {pageState.loading ? <p className="banner">Loading saved trees...</p> : null}

        <div className="tree-list">
          {trees.map((record, index) => (
            <section className="tree-card" key={record.clientId}>
              <div className="tree-card-header">
                <div>
                  <h2>Tree {index + 1}</h2>
                  <p>{record.status}</p>
                </div>
                {record.id ? <span className="tree-badge">ID {record.id}</span> : null}
              </div>

              <TreeView
                tree={record.tree}
                setTree={(nextTree) => handleTreeChange(record.clientId, nextTree)}
              />

              <div className="tree-actions">
                <button
                  className="secondary-button"
                  onClick={() => handleExport(record.clientId)}
                  type="button"
                >
                  Export
                </button>
              </div>

              {record.exportText ? (
                <pre className="export-output">{record.exportText}</pre>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
