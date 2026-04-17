import TagView from "./TagView";

const TreeView = ({ tree, setTree }) => {
  return <TagView node={tree} updateNode={setTree} depth={0} path="root" />;
};

export default TreeView;
