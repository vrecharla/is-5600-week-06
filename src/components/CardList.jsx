// src/components/CardList.jsx
import React, { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import Search from "./Search";

const CardList = ({ data }) => {
  // number of products per page
  const limit = 10;

  // full list after applying any search filter
  const [filteredData, setFilteredData] = useState(data);

  // current starting index for pagination
  const [offset, setOffset] = useState(0);

  // products currently shown on the page
  const [products, setProducts] = useState([]);

  // reset filtered data if the original data prop changes
  useEffect(() => {
    setFilteredData(data);
    setOffset(0);
  }, [data]);

  // recompute visible products whenever offset or filteredData changes
  useEffect(() => {
    const slice = filteredData.slice(offset, offset + limit);
    setProducts(slice);
  }, [filteredData, offset, limit]);

  // single pagination handler for both directions
  const changePage = (direction) => {
    if (direction === "next") {
      const nextOffset = offset + limit;

      // do not go past the end of the list
      if (nextOffset < filteredData.length) {
        setOffset(nextOffset);
      }
    } else if (direction === "prev") {
      const prevOffset = offset - limit;

      // do not go below 0
      setOffset(prevOffset < 0 ? 0 : prevOffset);
    }
  };

  // filter products by tags, called from <Search />
  const filterTags = (searchTerm) => {
    const term = searchTerm.trim().toLowerCase();

    // empty search → reset to all products
    if (!term) {
      setFilteredData(data);
      setOffset(0);
      return;
    }

    const filtered = data.filter((product) => {
      const tags = product.tags;
      if (!tags || !Array.isArray(tags)) return false;

      // handle both string tags and object tags (e.g. { title: "abstract" })
      return tags.some((tag) => {
        if (typeof tag === "string") {
          return tag.toLowerCase().includes(term);
        }

        if (tag && typeof tag === "object") {
          if (
            typeof tag.title === "string" &&
            tag.title.toLowerCase().includes(term)
          ) {
            return true;
          }
          if (
            typeof tag.name === "string" &&
            tag.name.toLowerCase().includes(term)
          ) {
            return true;
          }
        }

        return false;
      });
    });

    setFilteredData(filtered);
    setOffset(0); // go back to first page after filtering
  };

  const isPrevDisabled = offset === 0;
  const isNextDisabled = offset + limit >= filteredData.length;

  return (
    <div className="cf pa2">
      {/* Search box */}
      <div className="mt2 mb3">
        <Search handleSearch={filterTags} />
      </div>

      {/* Cards */}
      <div className="mt2 mb2">
        {products.map((product) => (
          <Card key={product.id} {...product} />
        ))}

        {products.length === 0 && (
          <p className="tc i">No products match that tag.</p>
        )}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center justify-center pa4">
        <Button
          text="Previous"
          handleClick={
            isPrevDisabled ? undefined : () => changePage("prev")
          }
        />
        <Button
          text="Next"
          handleClick={
            isNextDisabled ? undefined : () => changePage("next")
          }
        />
      </div>
    </div>
  );
};

export default CardList;
