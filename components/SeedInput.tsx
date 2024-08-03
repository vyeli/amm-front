/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

interface SeedInputProps {
    name: string;
  }
  
  const SeedInput: React.FC<SeedInputProps> = ({ name }) => {
    return (
      <div>
        <label
          htmlFor="seed"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Seed
        </label>
        <div className="relative mt-2 rounded-md shadow-sm mb-5">
          <input
            required
            id="seed"
            name="seed"
            type="text"
            placeholder="seed"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    );
  };
  
  export default SeedInput;
  