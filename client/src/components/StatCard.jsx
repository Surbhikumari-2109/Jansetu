const StatCard = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200">
      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-3">
        {value}
      </h2>

      <p className="text-xs text-slate-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
};

export default StatCard;