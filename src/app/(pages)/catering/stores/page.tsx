import StoreCard from "@/components/catering/storeCards";

const Stores = () => {
  return (
    <div className="p-4 mb-20">
      <h1 className="text-2xl font-bold text-center mt-4">Food Stores</h1>
      <p className="text-center mt-2">Explore our variety of food stores</p>
      {dummyStores.map((store, i) => (
        <div key={i} className="mt-4">
          <StoreCard imageSrc={store.image} name={store.name} description={store.description}/>
        </div>
      ))}
    </div>
  );
};

export default Stores;

const dummyStores = [
  {
    id: 1,
    name: "Fresh Bites",
    description: "Organic and fresh food items.",
    image: "/table.jpg",
  },
  {
    id: 2,
    name: "Gourmet Delights",
    description: "Premium quality gourmet food.",
    image: "/table1.jpg",
  },
  // {
  //     id: 3,
  //     name: "Quick Snacks",
  //     description: "Tasty and quick snack options.",
  //     image: "https://via.placeholder.com/150",
  // },
];
