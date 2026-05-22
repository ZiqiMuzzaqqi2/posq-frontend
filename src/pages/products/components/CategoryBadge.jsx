// Warna berbeda untuk setiap kategori (berdasarkan hash dari nama)
const getCategoryColor = (categoryName) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-yellow-100 text-yellow-700",
  ];

  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = (hash << 5) - hash + categoryName.charCodeAt(i);
    hash = hash & hash;
  }

  return colors[Math.abs(hash) % colors.length];
};

const CategoryBadge = ({ category }) => {
  if (!category)
    return <span className="text-gray-400 text-xs">No category</span>;

  const colorClass = getCategoryColor(category.name);

  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {category.name}
    </span>
  );
};

export default CategoryBadge;
