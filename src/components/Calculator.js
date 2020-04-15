import React, { Component } from "react";
import * as math from "mathjs";
import Button from '@material-ui/core/Button';
import info from '../img/info.svg';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// math.config({
//     number: 'BigNumber',      // Default type of number:
//     // 'number' (default), 'BigNumber', or 'Fraction'
//     precision: 5             // Number of significant digits for BigNumbers
// })

const roundVal = (val, dec) => {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
};

const loader = {
    display: 'none',
    visibility: 'hidden',
    opacity: '0.0',
    transition: 'visibility 0s. opacity 4s linear'
}

const style = {
    borderRadius: 50,
    border: 0,
    fontSize: '1rem',
    height: 48,
};

const opperation = {
    borderRadius: 50,
    border: 0,
    color: '#4aa6ca',
    height: 48,
    fontSize: '1.2rem',
    textTransform: 'lowercase',
}
class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = { // these switches control the state of the app without the use of props
            mDisplay: 0,
            sDisplay: '',
            memDisplay: '',
            init: false,
            relation: false,
            getVal: false,
            decimalClick: false,
            disableExpress: false,
            open: false,
            relationDuplicate: false
        };

        this.handleNumClick = this.handleNumClick.bind(this);
        this.handleAC = this.handleAC.bind(this);
        this.handleRelationClick = this.handleRelationClick.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleExpression = this.handleExpression.bind(this);
        this.handlePercent = this.handlePercent.bind(this);
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    //This function is fired when a number is clicked. It goes into number mode
    handleNumClick(event) {
        let valNum = document.getElementById('display').textContent;
        document.getElementById('display').style.color = 'black';
        document.getElementById('display').classList.remove('tracking-in-expand');
        if ((valNum === '0' || valNum === "-0") && this.state.getVal === false) {
            //NOTE 1. for the case if zero is in the display
            if (valNum[0] === "-") {
                this.setState({
                    //the content of the display is zero so nothing needs updating if zero is pressed. 
                    mDisplay: "-" + event.target.textContent,
                    relation: false,
                    disableExpress: false
                });
            } else {
                this.setState({
                    //the content of the display is zero so nothing needs updating if zero is pressed. 
                    mDisplay: event.target.textContent,
                    relation: false,
                    disableExpress: false
                });
            }

        } else if (document.getElementById('display').textContent === 'error') {
            this.setState({
                mDisplay: event.target.textContent,
                relation: false,
                disableExpress: false
            })
        } else if (this.state.relation === true) {

            this.setState({
                mDisplay: event.target.textContent,
                relation: false,
                disableExpress: false
            });
        } else if (this.state.getVal === true) {
            this.setState({
                mDisplay: event.target.textContent,
                getVal: false,
                disableExpress: false
            });
        } else {
            //set the max digit input
            if (document.getElementById('display').textContent.length < 14) {
                this.setState({
                    //add unto the end of a string in display
                    mDisplay:
                        document.getElementById("display").textContent +
                        event.target.textContent,
                    disableExpress: false
                });
            }

        }
    }

    handleRelationClick(event) {
        let result = math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent).toString();
        const runState = (entity) => {
            // console.log("state4")
            this.setState({
                sDisplay: this.state.memDisplay === "" ? math.parse(
                    document.getElementById('sDisplay').textContent + document.getElementById('display').textContent
                ).toString({ parenthesis: 'auto' }) + entity : "(" + math.parse(
                    this.state.memDisplay
                ).toString({ parenthesis: 'auto' }) + ")" + entity,
                relation: true,
                mDisplay: math.round(math.format(math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent), { notation: 'fixed', precision: 12 }), 12).toString(),
                memDisplay: "",
                // mDisplay: Math.round(result * 100000000000) / 100000000000,
                // mDisplay: result,
                getVal: false,
                decimalClick: false,
                disableExpress: true

            });
        }

        const runRelationState = (entity) => {
            // console.log("state5");
            if (entity === "-" && document.getElementById('sDisplay').textContent.slice(-1) !== "-" && this.state.relationDuplicate === false) {
                this.setState({
                    sDisplay: document.getElementById('sDisplay').textContent + entity,
                    relationDuplicate: true
                });

            } else {
                if (this.state.relationDuplicate === true && entity !== "-") {
                    this.setState({
                        sDisplay: document.getElementById('sDisplay').textContent.slice(0, -2) + entity,
                        relationDuplicate: false
                    });
                } else {
                    // console.log("state6")
                    this.setState({
                        sDisplay: document.getElementById('sDisplay').textContent.slice(0, -1) + entity
                    });
                }

            }

        }


        //if we are in the relational state then update relation instead of adding another duplicate
        if (this.state.relation === true) {
            if (event.target.textContent === '÷') {
                runRelationState('/');
            } else if (event.target.textContent === 'x') {
                runRelationState('*');
            } else {
                runRelationState(event.target.textContent);
            }

        } else {
            //turns on relational state to prevent duplicates like ++ in the display
            // console.log(math.parse('2 * 1 + x / 5').toString({ parenthesis: 'auto' }))
            if (math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent).toString() === "NaN") {
                document.getElementById('display').style.color = 'red';
                this.setState({
                    mDisplay: 'error',
                    sDisplay: '',
                    relation: false,
                    getVal: true,
                    decimalClick: false
                });
            } else if (document.getElementById('sDisplay').textContent + document.getElementById('display').textContent === 'error') {
                this.handleAC();
            } else {
                document.getElementById('display').style.color = 'green';
                document.getElementById('display').classList.add('tracking-in-expand');

                //If the relation symbol click has a different symbol than what is calculated this code makes sure the correct symbol is changed.
                if (event.target.textContent === '÷') {
                    runState('/');
                } else if (event.target.textContent === 'x') {
                    runState('*');
                } else {
                    runState(event.target.textContent)
                }
            }
        }
    }

    handleAC(event) {
        document.getElementById('display').style.color = 'black';
        document.getElementById('display').classList.remove('tracking-in-expand');
        this.setState({
            mDisplay: 0,
            sDisplay: '',
            memDisplay: '',
            relation: false,
            getVal: false,
            decimalClick: false,
            disableExpress: false,
            relationDuplicate: false
        });
    }

    handleEquals() {

        document.getElementById('display').classList.add('tracking-in-expand');
        // document.getElementById('display').classList.remove('tracking-in-expand');
        // console.log(math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent).toString())

        if (math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent).toString() === "NaN") {
            document.getElementById('display').style.color = 'red';
            this.setState({
                mDisplay: 'error',
                sDisplay: '',
                relation: false,
                getVal: true,
                decimalClick: false
            });
        } else if (document.getElementById('sDisplay').textContent + document.getElementById('display').textContent === 'error') {

            this.handleAC();
        } else {
            document.getElementById('display').style.color = 'green';
            let result = math.round(math.format(math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent), { notation: 'fixed', precision: 12 }), 12).toString();
            let memory = document.getElementById('sDisplay').textContent + document.getElementById('display').textContent;
            // let regex = regex = /[^\w\s]/g;
            // let locateDec = result.search('.');
            // if (result.length >= 11) {
            //     console.log("too large");
            // }
            console.log("ans = " + math.format(parseFloat(result), { notation: "auto", precision: 12 }))
            this.setState({
                // mDisplay: math.round(math.format(math.eval(document.getElementById('sDisplay').textContent + document.getElementById('display').textContent), { notation: 'fixed', precision: 12 }), 12).toString(),
                // mDisplay: math.eval(((document.getElementById('sDisplay').textContent + document.getElementById('display').textContent) + " * 10 ^ 16") + "/10^16"),
                mDisplay: math.format(parseFloat(result), { notation: "auto", precision: 12 }),
                memDisplay: memory,
                sDisplay: '',
                relation: false,
                getVal: true,
                decimalClick: false,
                disableExpress: false,
                relationDuplicate: false
            });
        }

    }

    handleDecimal() {

        if (this.state.decimalClick === false && this.state.getVal === false && this.state.relation === false) {
            document.getElementById('display').style.color = 'black';
            this.setState({
                mDisplay: document.getElementById('display').textContent + '.',
                decimalClick: true
            });
        } else if ((this.state.decimalClick === false && this.state.getVal === true)) {
            document.getElementById('display').style.color = 'black';
            this.setState({
                mDisplay: '0.',
                decimalClick: true,
                getVal: false
            });
        }
    }

    handleExpression() {
        // console.log(document.getElementById('display').textContent[document.getElementById('display').textContent.length - 1]);
        let val = document.getElementById('display').textContent;


        if (document.getElementById('display').textContent !== 'error' && this.state.disableExpress === false) {
            if ((this.state.decimalClick === true && document.getElementById('display').textContent[document.getElementById('display').textContent.length - 1] === ".") || document.getElementById('display').textContent === '0.0') {
                // console.log("State 1")
                this.setState({
                    mDisplay: val[0] === "-" ? val.substr(1) : "-" + val
                });
            } else {
                // state 2 is when the display shows a number
                // console.log("State 2 && " + val[0]);
                this.setState({

                    // mDisplay: '-' + math.eval(document.getElementById('display').textContent)
                    mDisplay: val[0] === "-" ? val.substr(1) : "-" + val
                });
            }
        }

        if (document.getElementById('display').textContent !== 'error' && this.state.disableExpress === true) {
            // console.log("state3");
            this.setState({
                mDisplay: "-0"
            });

        }
    }

    handlePercent() {
        if (document.getElementById('display').textContent !== 'error' && this.state.disableExpress === false) {
            if (math.round(math.format(math.eval(document.getElementById('display').textContent + '/100'), { notation: 'fixed', precision: 12 }), 12).toString().indexOf('.') > -1) {
                this.setState({
                    decimalClick: true
                });
            }

            this.setState({
                mDisplay: math.round(math.format(math.eval(document.getElementById('display').textContent + '/100'), { notation: 'fixed', precision: 12 }), 12).toString()
            });

            // console.log(math.round(math.format(math.eval(document.getElementById('display').textContent + '/100'), { notation: 'fixed', precision: 12 }), 12).toString().indexOf('.') > -1)
        }
    }

    render() {
        window.onload = function () {
            document.getElementById('render-container').style.display = 'flex';
            document.getElementById('render-container').style.visibility = 'visible';
            let opacity = 0;
            // let renderOpacity = document.getElementById('render-container').style.opacity;


            function fadeIn() {

                if (opacity < 1) {
                    opacity += 0.1;
                    document.getElementById('render-container').style.opacity = opacity;
                    setTimeout(fadeIn, 100);
                }
            }

            fadeIn();
            // console.log(math.round(math.format(math.eval(17 + document.getElementById('display').textContent), { notation: 'fixed', precision: 12 }), 12).toString());

        }


        return (
            <div id='render-container' style={loader} className="main-page">
                <div className="calc-window">
                    <div id="display-container">
                        <h1 id="display">{this.state.mDisplay}</h1>
                        <p id="sDisplay">{this.state.sDisplay}</p>
                    </div>
                    <div id="controls">
                        <div >
                            <Button id="clear" onClick={this.handleAC} style={style}>ac</Button>
                        </div>
                        <div>
                            {/* <Button style={style} onClick={this.handleExpression}>+/-</Button> */}
                        </div>
                        <div>
                            <Button style={style} onClick={this.handlePercent}>%</Button>
                        </div>
                        <div className='operation' >

                            <Button id='divide' onClick={this.handleRelationClick} style={opperation}>&#247;</Button>
                            {/* <Button className='psuedo-opps' style={opperation} >&#247;</Button> */}
                        </div>
                        <div >
                            <Button id="seven" onClick={this.handleNumClick} style={style}>7</Button>
                        </div>
                        <div >
                            <Button id="eight" onClick={this.handleNumClick} style={style}>8</Button>
                        </div>
                        <div>
                            <Button id="nine" onClick={this.handleNumClick} style={style}>9</Button>
                        </div>
                        <div className="operation"  >
                            <Button id="multiply" onClick={this.handleRelationClick} style={opperation}>x</Button>
                        </div>
                        <div>
                            <Button id="four" onClick={this.handleNumClick} style={style}>4</Button>
                        </div>
                        <div>
                            <Button id="five" onClick={this.handleNumClick} style={style}>5</Button>
                        </div>
                        <div>
                            <Button id="six" onClick={this.handleNumClick} style={style}>6</Button>
                        </div>
                        <div className="operation" >
                            <Button id='subtract' onClick={this.handleRelationClick} style={opperation}>-</Button>
                        </div>
                        <div >
                            <Button id="one" onClick={this.handleNumClick} style={style}>1</Button>
                        </div>
                        <div >
                            <Button id="two" onClick={this.handleNumClick} style={style}>2</Button>
                        </div>
                        <div >
                            <Button id="three" onClick={this.handleNumClick} style={style}>3</Button>
                        </div>
                        <div className="operation" >
                            <Button id='add' onClick={this.handleRelationClick} style={opperation}>+</Button>
                        </div>
                        <div>
                            <img src={info} alt="info" onClick={this.handleClickOpen} />
                        </div>
                        <div>
                            <Button id="zero" onClick={this.handleNumClick} style={style}>0</Button>
                        </div>
                        <div>
                            <Button id="decimal" onClick={this.handleDecimal} style={style}>.</Button>
                        </div>
                        <div className="operation wave-fx" >
                            <Button id="equals" onClick={this.handleEquals} style={opperation}>=</Button>
                        </div>
                    </div>
                    {/* <div className="info-adj" >
                        <img src={info} alt="info" onClick={this.handleClickOpen} />
                    </div> */}

                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"FCC (Free Code Camp) JS calculator."}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Developed by <a href="https://exogenist.tech" target='_blank' rel='noopener noreferrer' >Swainson holness</a>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>


                {/* <p className='tag'>Developed by <a href="https://exogenist.tech" target='_blank' noopener noreferrer>Swainson holness</a></p> */}
            </div>
        );
    }
}

export default Calculator;
