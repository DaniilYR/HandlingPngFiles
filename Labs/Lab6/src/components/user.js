import React from 'react';
import "./user.css"

var pr = 0;

export default class User extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            start: props.start_exchange,
            username: props.username,
            brokers: props.brokers,
            stocks: props.stocks,
            count: -1,
            index: -1,
            pr: 0
        };
    }

    render() {
        return (
            <div className="User">
                <nav className="two">
                    <ul>
                        <li>{this.props.username}</li>
                        <li>Прибыль на текущий момент: {pr}</li>
                    </ul>
                </nav>

                <div className="Ubrokers">
                    {this.get_info(this.props.username, this.props.brokers)}
                </div>
                <div className="torgs">
                    {this.get_torgs(this.props.stocks)}
                </div>
                <div className="UDeal">
                    <p> Продать </p>
                    <table className="Sell">
                        <tr>
                            <th>id</th>
                        </tr>
                        <tr>
                            <td><input onChange={this.get_index}/></td>
                        </tr>
                        <tr>
                            <th>количество</th>
                        </tr>
                        <tr>
                            <td><input onChange={this.get_count}/></td>
                        </tr>
                    </table>
                    <button className={"butDeal" + this.props.start} onClick={this.sell}> - </button>
                </div>
                <div className="UDeal">
                    <p> Купить </p>
                    <table className="Buy">
                        <tr>
                            <th>id</th>
                        </tr>
                        <tr>
                            <td><input id="indexx" onChange={this.get_index}/></td>
                        </tr>
                        <tr>
                            <th>количество</th>
                        </tr>
                        <tr>
                            <td><input onChange={this.get_count}/></td>
                        </tr>
                    </table>
                    <button className={"butDeal"+ this.props.start} onClick={this.buy}> + </button>
                </div>
            </div>
        );
    }

    get_info(name, br) {
        for (let i = 0; i < br.length; i++) {
            if (br[i].name === name) {
                let broker = [];
                pr = br[i].money - br[i].start_money;
                broker.push(<p> Запас денежных стредств: {br[i].money} </p>);
                let table = [];
                table.push(
                    <tr>
                        <th>id</th>
                        <th>количество</th>
                        <th>стоимость</th>
                        <th>на торгах</th>
                        <th>стоимость</th>
                    </tr>
                );
                for (let j = 0; j < br[i].stocks.length; j++) {
                    table.push(
                        <tr>
                            <td>{j}</td>
                            <td>{br[i].stocks[j]}</td>
                            <td>{br[i].price[j]}</td>
                            <td> {br[i].ontorg_stocks[j]} </td>
                            <td>{br[i].ontorg_price[j]}</td>
                        </tr>
                    )
                }
                broker.push(<table>{table}</table>);
                return <div className="Ubroker">{broker}</div>
            }
        }
    }

    get_torgs(st) {
        let table = [];
        table.push(
            <tr>
                <th>id</th>
                <th>количество</th>
                <th>цена</th>
            </tr>
        );

        for (let i = 0; i < st.length; i++) {
            table.push(
                <tr>
                    <td>{i}</td>
                    <td>{st[i].in_torg}</td>
                    <td>{st[i].price}</td>
                </tr>
            )
        }
        return <div className="Ubroker" id="tt"><p> Акции на торгах</p><table>{table}</table></div>
    }

    sell = (event) => {
        console.log(this.state.index , this.state.count, this.state.username);
        if(this.state.index > this.state.stocks.length) {
            console.log(this.state.index ,">", this.state.stocks.length);
            return;
        }
        let br = this.props.brokers;
        for (let i = 0; i < br.length; i++) {
            if (br[i].name === this.state.username) {
                if(this.state.count === -1  || this.state.index === -1 || this.state.count < 0 || this.state.count > br[i].stocks[this.state.index]) {
                    console.log("NO%%%%%%");
                    console.log(this.state.count)
                    console.log(br[i].stocks[this.state.index])
                    return;
                }
            }
        }
        this.props.sell(this.props.username, this.state.index, this.state.count, this.props.brokers, this.props.stocks, this.state.pr);
    };

    buy = (event) => {
        console.log(event.target)
        console.log(this.state.count);
        let br = this.props.brokers;
        if(this.state.index > this.state.stocks.length) {
            console.log("NOT SUCCESS");
            console.log("index > stocks.length");
            return;
        }
        for (let i = 0; i < br.length; i++) {
            if (br[i].name === this.state.username) {
                if(this.state.count === -1  || this.state.index === -1 || this.state.count < 0 || this.state.count > this.props.stocks[this.state.index].in_torg) {
                    // console.log(this.state.index);
                    // console.log(this.state.stocks[this.state.index].in_torg);
                    console.log("NOT SUCCESS");
                    return;
                }
                if(br[i].money < this.state.stocks[this.state.index].price * this.state.count) {
                    return
                }
            }
        }
        console.log("SUCCESS");

        this.props.buy(this.props.username, this.state.index, this.state.count, this.props.brokers, this.props.stocks, this.state.pr);

    };

    get_index = (event) => {
        this.setState({index: Number(event.target.value)});
    };

    get_count = (event) => {
        this.setState({count: Number(event.target.value)});
    };

}
