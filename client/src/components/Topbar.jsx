const Topbar = () => {
  return (
    <header
      className="
      h-20
      bg-white
      border-b
      border-slate-200
      flex
      items-center
      justify-between
      px-6
    "
    >
      <div>
        <h2 className="font-bold text-xl">
          Dashboard
        </h2>

        <p className="text-slate-500 text-sm">
          Welcome back
        </p>
      </div>

      <div
        className="
        h-11
        w-11
        rounded-full
        bg-indigo-100
        flex
        items-center
        justify-center
        font-bold
      "
      >
        S
      </div>
    </header>
  );
};

export default Topbar;