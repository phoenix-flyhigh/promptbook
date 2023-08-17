"use client";

import { Post } from "@/utils/PromptService";
import { useState, Dispatch, SetStateAction } from "react";
import Card from "../Card";

export type UseStateType<T> = [T, Dispatch<SetStateAction<T>>]

interface FeedViewProps {
  posts: Post[]
}

const CardList = ({ data, handleTagClick }: {
  data: Post[],
  handleTagClick: (tagName: string) => void
}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <Card
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const FeedView = ({posts}: FeedViewProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout]: any = useState(undefined);
  const [searchedResults, setSearchedResults]: UseStateType<Post[]> = useState([] as Post[]);

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i");

    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e: any) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 50)
    );
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          data-testid="tid-search-input"
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {searchText ? (
        <CardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <CardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default FeedView;
