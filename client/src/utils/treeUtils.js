export const cleanTree = (node) => {
  const result = { name: node.name };

  if (node.children?.length) {
    result.children = node.children.map(cleanTree);
  } else {
    result.data = node.data;
  }

  return result;
};

export const createNewChild = () => ({
  name: "New Child",
  data: "Data"
});

export const createDefaultTree = () => ({
  name: "root",
  children: [
    {
      name: "child1",
      children: [
        {
          name: "child1-child1",
          data: "c1-c1 Hello"
        },
        {
          name: "child1-child2",
          data: "c1-c2 JS"
        }
      ]
    },
    {
      name: "child2",
      data: "c2 World"
    }
  ]
});

export const normalizeTree = (node) => {
  const normalizedName =
    typeof node?.name === "string" && node.name.trim() ? node.name : "New Child";

  if (Array.isArray(node?.children) && node.children.length > 0) {
    return {
      name: normalizedName,
      children: node.children.map(normalizeTree)
    };
  }

  return {
    name: normalizedName,
    data: typeof node?.data === "string" ? node.data : "Data"
  };
};
