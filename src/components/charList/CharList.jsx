import { Component } from 'react';
import MarvelServices from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        newItemLoaded: false,
        offset: 210,
        charEnded: false,
    }

    marvelServices = new MarvelServices()

    componentDidMount() {
        this.getCharacters()
    }

    onCharLoading = () => {
        this.setState({
            newItemLoaded: true
        })
    }

    onCharactersLoaded = (newCharacters) => {

        let ended = false
        if (newCharacters.lenght < 9) {
            ended = true
        }

        this.setState(({ characters, offset }) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            newItemLoaded: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    getCharacters = (offset) => {
        this.onCharLoading()
        this.marvelServices
            .getAllCharacters(offset)
            .then(this.onCharactersLoaded)
    }

    render() {
        const { loading, offset, charEnded } = this.state
        return (
            <div className="char__list">
                {
                    loading && <Spinner />
                }
                <ul className="char__grid">
                    {this.state.characters.map(item => <CharItems onClick={() => this.props.onCharLoaded(item.id)} key={item.id} name={item.name} thumbnail={item.thumbnail} />)}
                </ul>
                <button
                    className="button button__main button__long"
                    onClick={() => this.getCharacters(offset)}
                    disabled={this.state.newItemLoaded}
                    style={{ display: charEnded ? 'nonde' : 'block' }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}



const CharItems = ({ name, thumbnail, onClick }) => {
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'fill' };
    }

    return (
        <li onClick={onClick} className="char__item">
            <img src={thumbnail} alt="abyss" style={imgStyle} />
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;