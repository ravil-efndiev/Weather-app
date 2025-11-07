import searchButtonSvg from "@/assets/search-btn.svg";

function SearchBar() {
  return (
    <div className="flex mb-10">
      <input
        type="text"
        placeholder="Search for your city..."
        className="w-[90%] flex-1 mx-auto bg-gray-700 rounded-full py-5 px-9 border border-transparent focus:border-gray-400 transition"
      />
      <button className="bg-gray-700 rounded-full p-5 ml-3 hover:bg-gray-600 transition active:bg-gray-500">
        <img src={searchButtonSvg} alt="Search" width={30} />
      </button>
    </div>
  );
}

export default SearchBar;
