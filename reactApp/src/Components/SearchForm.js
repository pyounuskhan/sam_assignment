import React, {useState} from 'react';

const SearchForm = ({onSearch}) => {
    const [keyword, setKeyword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(keyword);
    };
    return(
        <form onSubmit={handleSubmit}>
            <input
            type='text'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Enter Keyword'>
            </input>
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchForm;