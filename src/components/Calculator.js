import React, { Component } from 'react';

class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: 'test text'
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        alert('working!')
    }


    render() {

        return (
            <div className='main-page'>
                <div className='calc-window'>
                    <div id='display'>
                        <h1>34.3876274</h1>
                        <p>34.3876274</p>
                    </div>
                    <div id='controls'>
                        <div onClick={this.handleClick}><p>ac</p></div>
                        <div><p>+/-</p></div>
                        <div><p>%</p></div>
                        <div className='operation'><p>&#247;</p></div>
                        <div id='seven'><p>7</p></div>
                        <div id='eight'><p>8</p></div>
                        <div id='nine'><p>9</p></div>
                        <div className='operation'><p>x</p></div>
                        <div id='four' ><p>4</p></div>
                        <div id='five'><p>5</p></div>
                        <div id='six'><p>6</p></div>
                        <div className='operation'><p>-</p></div>
                        <div id='one' ><p>1</p></div>
                        <div id='two'><p>2</p></div>
                        <div id='three'><p>3</p></div>
                        <div className='operation'><p>+</p></div>
                        <div></div>
                        <div id='zero'><p>0</p></div>
                        <div><p>.</p></div>
                        <div className='operation wave-fx' id='equals' ><p>=</p></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calculator;