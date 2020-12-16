import React from 'react';
import "./admin.css"


export default class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            stocks : this.props.stocks
        };
    }

    render() {
        return (
            <div className="Admin">
                <nav className="one">
                    <ul>
                        <li> Admin</li>
                        <li id="b" onClick={this.props.start_torgs}> Начать торги</li>
                    </ul>
                </nav>

                <div className="stocks ad">
                    {this.get_stocks(this.props.stocks)}
                </div>

                <div className="brokers ad">
                    {this.get_brokers(this.props.brokers)}
                </div>
            </div>
        );
    }

        get_stocks(st){
            let stocks=[];
            let table = [];
            table.push(
                <tr>
                    <th>id</th>
                    <th>Количество</th>
                    <th>Цена</th>
                    <th>Закон распределения</th>
                </tr>
            )
            for(let i = 0; i < st.length; i++){
                table.push(
                    <tr>
                        <td>{st[i].id}</td>
                        <td>{st[i].in_torg}</td>
                        <td>{st[i].price}</td>
                        <td>{st[i].distribution}</td>
                        <button id='change' className={'change' + this.props.start} value={i} onClick={this.distChange}>&#8634;</button>
                    </tr>
                )
            }
            stocks.push(<p>Акции:</p>)
            stocks.push(<table className="table">{table}</table>)
            return <div>{stocks}</div>
        }

        distChange = (event) => {
            console.log(event.target.value);
            let stocks = this.props.stocks;
            let law = stocks[event.target.value].distribution;
            if (law === 'нормальный') {
                law = 'равномерный';
            } else {
                law = 'нормальный';
            }
            stocks[event.target.value].distribution = law;
            this.setState(stocks);
            this.props.setState(stocks);
        };

        get_brokers(br){
            let brokers=[];
            for (let i = 0; i < br.length; i++){
                let broker = [];
                broker.push(<p> Имя: {br[i].name} </p>);
                broker.push(<p> Денежный счет: {br[i].money} </p>);
                let table = [];
                table.push(
                    <tr>
                        <th>id</th>
                        <th>количество</th>
                        <th>стоимость</th>
                    </tr>
                );
                for (let j = 0; j < br[i].stocks.length; j++){
                    table.push(
                        <tr>
                            <td>{j}</td>
                            <td>{br[i].stocks[j]}</td>
                            <td>{br[i].price[j]}</td>
                        </tr>
                    )
                }
                broker.push(<table className="tab">{table}</table>)
                brokers.push(<div className = "broker" key = {br[i].id}> {broker}</div>)
            }
            return <div>{brokers}</div>
        }

}
