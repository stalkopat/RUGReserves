import Head from 'next/head'
import Header from '@components/Header'
import { Component } from 'react'
import { Reserve } from 'functions/Reserves'

export default class Home extends Component {

  constructor() {
    super();
    this.state = { reserves: Reserve, ready: false };
  }

  componentDidMount() {
    this.state.reserves.Init().then((res) => {
      this.setState({ ready: true, Liq: res.LiquidityTokens, Res: res.ReserveTokens, actualReserves: res.ActualReserves });
      console.log(JSON.stringify(this.state
      ));
    });
  }

  render() {
    console.log(this.state.Liq);
    return !this.state.ready ? "Loading..." : (
      <div className="container">
        <Head>
          <title>Rug Treasury Assets</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Header title="Current Treasury Assets and their valuations" />
          <br></br>
          <p class="font-medium">Liquditity Tokens</p>
          <div class="table">
            <div class="table-header-group">
              <div class="bg-blue-100 border table-cell text-right">
                Token
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Amount
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Value
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Decimals
              </div>
            </div>
            <div class="table-row-group">
              {
                this.state.Liq.map((token) =>
                  <div class="table-row">
                    <div class="border table-cell text-right">{token.token}</div>
                    <div class="border table-cell text-right">{token.amount.toString()}</div>
                    <div class="border table-cell text-right">{token.value.toString()}</div>
                    <div class="border table-cell text-right">{token.decimals.toString()}</div>
                  </div>
                )
              }
            </div>
            <p class="font-medium">Reserve Tokens</p>
            <div class="table-header-group">
              <div class="bg-blue-100 border table-cell text-right">
                Token
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Amount
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Value
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Decimals
              </div>
            </div>
            <div class="table-row-group">
              {
                this.state.Res.map((token) =>
                  <div class="table-row">
                    <div class="border table-cell text-right">{token.token}</div>
                    <div class="border table-cell text-right">{token.amount.toString()}</div>
                    <div class="border table-cell text-right">{token.value.toString()}</div>
                    <div class="border table-cell text-right">{token.decimals.toString()}</div>
                  </div>
                )
              }</div>
            <p class="font-medium">Should be Treasury Reserves</p>
            <div class="table-header-group">
              <div class="bg-blue-100 border table-cell text-right">
                Treasury
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Amount
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Value
              </div>
              <div class="bg-blue-100 border table-cell text-right">
                Decimals
              </div>
            </div>
            <div class="table-row-group">
              <div class="table-row">
                <div class="border table-cell text-left">Current Reserves</div>
                <div class="border table-cell text-right"></div>
                <div class="border table-cell text-right">{this.state.actualReserves}</div>
                <div class="border table-cell text-right"></div>
              </div>
              <div class="table-row">
                <div class="border table-cell text-left">Should be Reserves</div>
                <div class="border table-cell text-right"></div>
                <div class="border table-cell text-right">{this.state.Res.reduce((a,b)=>a+parseInt(b.value), 0)+this.state.Liq.reduce((a,b)=>a+parseInt(b.value), 0)}</div>
                <div class="border table-cell text-right"></div>
              </div>
              <div class="table-row">
                <div class="border table-cell text-left">Missing Reserves</div>
                <div class="border table-cell text-right"></div>
                <div class="border table-cell text-right">{(this.state.Res.reduce((a,b)=>a+parseInt(b.value), 0)+this.state.Liq.reduce((a,b)=>a+parseInt(b.value), 0))-this.state.actualReserves}</div>
                <div class="border table-cell text-right"></div>
              </div>
            </div>
          </div>
        </main>

      </div>
    );
  }
}
