const CategoryPage = async ({ params }: { params: { ex: string } }) => {
    // ...
    let notes = await (params.ex);
    console.log('a',notes);
    return (
        <div>
            <h1>Category Page</h1>
            <p>Category ID: {params.ex}</p>
        </div>
    );
  }


  export default CategoryPage;