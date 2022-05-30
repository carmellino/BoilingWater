const { response } = require('express');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.listen(8080, () => console.log('Odpalony na 8080'));
app.use(express.static('data'));
app.use(bodyParser.json());

class Supplier 
{
    constructor(a, b, c)
    {
        this.id = a;
        this.supply = b;
        this.available = b;
        this.buyingCost = c;
    }

    subtractFromAvailable(a)
    {
       this.available -= a;
    }
}

class Customer 
{
    constructor(a, b, c)
    {
        this.id = a;
        this.demand = b;
        this.available = b;
        this.sellingCost = c;
    }

    
    subtractFromAvailable(double)
    {
        this.available -= a;
    }
}

class Transport 
{
    constructor(a, b)
    {   
        this.suppliersAmount = a;
        this.customersAmount = b;
        this.suppliers =  [];
        this.customers = [];
        this.transportCost = [];
        this.gains = [];
        this.path=[];
        for(var i=0;i<4;++i)
        {
            this.path[i] = [-1, -1];
        }

        this.supply=0.0;
        this.demand=0.0;
        this.suppliers = [];
        this.customers = [];
        this.broker;
        this.transportCost = [];
        this.gains = [];
        this.deals = [];
        this.base = [];
        this.deltas = [];
        this.path = [];
        this.alfas = [];
        this.betas = [];
        this.checked = [];
        this.everyIteration =[];
    }

    calculateSupply()
    {
        this.supply = 0.0;
        for(var i=0;i<this.suppliersAmount;++i)
            this.supply += this.suppliers[i].supply;
    }

    calculateDemand()
    {
        this.demand = 0.0;
        for(var i=0;i<this.customersAmount; ++i)
            this.demand += this.customers[i].demand;
    }

    getFictional()
    {
        if(this.supply != this.demand)
        {
            this.suppliersAmount +=1;
            this.customersAmount +=1;

            if(this.supply > this.demand)
            {
                this.suppliers.push(new Supplier(this.suppliersAmount-1, 0,0));
                this.customers.push(new Customer(this.customersAmount-1, this.supply-this.demand,0));
            }
            else
            {
                this.suppliers.push(new Supplier(this.suppliersAmount-1, this.demand-this.supply,0));
                this.customers.push(new Customer(this.customersAmount-1, 0,0));
            }
            this.transportCost.push([0]);
            for(var i=0;i<this.suppliersAmount; ++i)
            this.transportCost[this.transportCost.length-1][i] = 0;
            
            for(var i=0;i<this.suppliersAmount; ++i)
                this.transportCost[i].push(0);
            
            this.gains.push([0]);
            for(var i=0;i<this.suppliersAmount; ++i)
                this.gains[this.gains.length-1][i] = 0;
            
            for(var i=0;i<this.suppliersAmount; ++i)
                this.gains[i].push(0);
        }
    }

    calculateGains()
    {
        for(var i=0;i<this.suppliersAmount; ++i){
            this.gains[i] = [];
            for(var j=0;j<this.customersAmount; ++j)
            this.gains[i][j] = this.customers[j].sellingCost - this.transportCost[i][j] - this.suppliers[i].buyingCost;
        }            
    }

    getFinalGain()
    {
        var finalGain = 0;
        for(var i=0;i<this.suppliersAmount; ++i)
            for(var j=0;j<this.customersAmount; ++j)
                finalGain += this.deals[i][j] * this.gains[i][j];

        console.log("FinalGain: " + finalGain);
        return finalGain;
    }
    
    getMinDeal()
    {
        var min=0, deal=0;
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            if(this.suppliers[i].available == 0)
                continue;

            for(var j=0;j<this.customersAmount; ++j)
            {
                if(this.customers[j].available == 0)
                    continue;

                if(this.customers[j].available > this.suppliers[i].available)
                    deal = this.suppliers[i].available * this.gains[i][j];

                else
                    deal = this.customers[j].available * this.gains[i][j];

                if(deal < min)
                    min = deal;
            }
        }
        return min;
    }

    initDealsArr()
    {
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            this.deals[i] = [0];
            for(var j=0;j<this.customersAmount; ++j)
            {
                this.deals[i][j] = 0;
            }
        }          
    }


    maxMetode()
    {
        this.initDealsArr();

        var minDeal = 0, max=0, deal=0, amount =0, maxAmount =0;
        var maxCustId=0, maxSuppId=0;
        var change = false;
        minDeal = this.getMinDeal();

        for(var k = 0; k < this.suppliersAmount * this.customersAmount; ++k)
        {
            max = minDeal;
            change = false;

            for(var i=0;i<this.suppliersAmount; ++i)
            {
                if(this.suppliers[i].available == 0)
                    continue;

                for(var j=0;j<this.customersAmount; ++j)
                {
                    if(this.customers[j].available == 0)
                        continue;

                    if(this.customers[j].available > this.suppliers[i].available)
                    {
                        deal = this.suppliers[i].available * this.gains[i][j];
                        amount = this.suppliers[i].available;
                    }
        
                    else
                    {
                        deal = this.customers[j].available * this.gains[i][j];
                        amount = this.customers[j].available;
                    }
                        
                    if(deal > max)
                    {
                        max = deal;
                        maxAmount = amount;
                        maxCustId = j;
                        maxSuppId = i;
                        change = true;
                    }
                    
                }
                
            }
            if(change)
            {
                this.deals[maxSuppId][maxCustId] = maxAmount;

                if(this.customers[maxCustId].available > this.suppliers[maxSuppId].available)
                {
                    this.customers[maxCustId].available -= this.suppliers[maxSuppId].available;
                    this.suppliers[maxSuppId].available -= this.suppliers[maxSuppId].available;
                }
                else
                {
                    this.suppliers[maxSuppId].available -= this.customers[maxCustId].available;
                    this.customers[maxCustId].available -= this.customers[maxCustId].available;
                }
            }
                
        }
    }

    initAlfasAndBetas()
    {        
        for(var i=0;i<this.suppliersAmount; ++i)
            this.alfas[i] = 0;

        for(var i=0;i<this.customersAmount; ++i)
            this.betas[i] = 0;
    }

    calculateAlfasAndBetas()
    {
        if(this.suppliersAmount > this.customersAmount)
        {
            var alfaId = this.suppliersAmount-1;
            for(var i=this.customersAmount-1; i>=0; --i)
            {
                this.betas[i] = this.transportCost[alfaId][i] - this.alfas[alfaId];
                alfaId--;
                this.alfas[alfaId] = this.transportCost[alfaId][i] - this.betas[i];
            }
            for(var i=alfaId; i>=0; --i)
            {
                this.alfas[i] = this.transportCost[i][0] - this.betas[0];
            }
        }
        else
        {
            var betaId = this.customersAmount-1;
            for(var i=this.suppliersAmount-1; i>0; --i)
            {
                this.betas[betaId] = this.transportCost[i][betaId] - this.alfas[i];
                this.alfas[i-1] = this.transportCost[i-1][betaId] - this.betas[betaId];
                betaId--;
            }
            for(var i=betaId; i>=0; --i)
            {
                this.betas[i] = this.transportCost[0][i] - this.alfas[0];
            }
        }
    }

    initBaseArr()
    {
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            this.base[i] = [];
            for(var j=0;j<this.customersAmount; ++j)
            {
                this.base[i][j] = false;
            }
        }          
    }


    getBase()
    {
        for(var i=0;i<this.suppliersAmount; ++i)
            for(var j=0;j<this.customersAmount; ++j)
                if(this.deals[i][j] != 0)
                    this.base[i][j] = true;
                else
                    this.base[i][j] = false;
    }

    initDeltasArr()
    {
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            this.deltas[i] = [];
            for(var j=0;j<this.customersAmount; ++j)
                this.deltas[i][j] = 0;
        }
            
    }

    calculateDeltas()
    {
        for(var i=0;i<this.suppliersAmount; ++i)
            for(var j=0;j<this.customersAmount; ++j)
                if(!this.base[i][j])
                    this.deltas[i][j] = this.transportCost[i][j] - this.alfas[i] - this.betas[j];
                else
                    this.deltas[i][j] = 0;
    }

    checkIfPositive()
    {
        for(var i=0;i<this.suppliersAmount; ++i)
            for(var j=0;j<this.customersAmount; ++j)
                if(!this.base[i][j])
                    if(this.deltas[i][j] > 0)
                        return true;
        return false;
    }

    findAndSetMaxDelta()
    {
        var max = 0;
        var maxI = -1, maxJ = -1;
        var inList = false;

        for(var i=0;i<this.suppliersAmount; ++i)
            for(var j=0;j<this.customersAmount; ++j)
                if(this.deltas[i][j] > max)
                {
                    for(var k=0;k<this.checked.length;++k)
                    {
                        if(this.checked[k][0] == i && this.checked[k][1] == j)
                            inList = true;
                    }
                    if(!inList)
                    {
                        max = this.deltas[i][j];
                        maxI = i;
                        maxJ = j;
                    }
                    else
                        inList = false;
                }
                 
        this.path[0] = [maxI,maxJ];
        this.checked.push(this.path[0]);
    }

    setPath()
    {   
        this.findAndSetMaxDelta();
        while( this.path[0][0] != -1 )
        {
            console.log('siema');
            for(var i=0;i<this.suppliersAmount; ++i)
            {
                console.log('siema1');
                if(this.base[i][this.path[0][1]] && i != this.path[0][0])
                {
                    console.log('siema2');
                    for(var j=0;j<this.customersAmount; ++j)
                    {
                        console.log('siema3');
                        if(this.base[i][j] && j != this.path[0][1])
                        {
                            console.log('siema4');
                            if(this.base[this.path[0][0]][j])
                            {
                                console.log('siema5');
                                this.path[1] = [i,this.path[0][1]];
                                this.path[2] = [i, j];
                                this.path[3] = [this.path[0][0],j];
                                this.checked = [];
                                return;
                            }
                        }
                    }
                }
            }
            console.log('teststbta');
            this.findAndSetMaxDelta();
            this.printBase();
        }
    }

    getMinInPath()
    {
        var min = this.deals[this.path[1][0]][this.path[1][1]];

        if(this.deals[this.path[2][0]][this.path[2][1]] < min)
            min = this.deals[this.path[2][0]][this.path[2][1]];

        if(this.deals[this.path[3][0]][this.path[3][1]] < min)
            min = this.deals[this.path[3][0]][this.path[3][1]];

        return min;
    }

    relocate()
    {
        var val = this.getMinInPath();
        this.deals[this.path[0][0]][this.path[0][1]] += val;
        this.deals[this.path[1][0]][this.path[1][1]] -= val;
        this.deals[this.path[2][0]][this.path[2][1]] += val;
        this.deals[this.path[3][0]][this.path[3][1]] -= val;
        this.getBase();
    }

    change()
    {
        this.setPath();
        if(this.path[0][0] == -1)
            return;
            this.relocate();
            this.calculateAlfasAndBetas();
            this.calculateDeltas();
    }

    goForIt()
    {
        while(this.checkIfPositive())
        {
            
            this.change();
            console.log('test');
            this.printDeals();
            this.printDeltas();
            this.printBase();
            this.everyIteration.push(this.deals);
            this.printEvery();
            if(this.path[0][0] == -1)
                return;
            
            
        }
    }

    setup()
    {
        this.calculateDemand();
        this.calculateSupply();
        this.calculateGains();
        this.getFictional();
    }

    firstTime()
    {
        this.initAlfasAndBetas();
        this.calculateAlfasAndBetas();

        this.initBaseArr();
        this.getBase();

        this.initDeltasArr();
        this.calculateDeltas();
    }

    printDeals()
    {
        console.log("Deals");
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            for(var j=0;j<this.customersAmount; ++j)
            {
                console.log(this.deals[i][j],"\n");
                // console.log("\t");
            }
            console.log();
        }
        console.log();
    }

    printCustomers()
    {
        console.log("Customers");
        console.log("id\tdemand\tsCost\tavailible");
        for(var i=0;i<this.customersAmount; ++i)
        {
            console.log(this.customers[i].id + "\t");
            console.log(this.customers[i].demand + "\t");
            console.log(this.customers[i].sellingCost + "\t");
            console.log(this.customers[i].available);
            console.log();
        }
        console.log();
    }

    printSuppliers()
    {
        console.log("Suppliers");
        console.log("id\tdemand\tbCost\tavailible");
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            console.log(this.suppliers[i].id + "\t");
            console.log(this.suppliers[i].supply + "\t");
            console.log(this.suppliers[i].buyingCost + "\t");
            console.log(this.suppliers[i].available);
            console.log();
        }
        console.log();
    }

    printTransportCosts()
    {
        console.log("TransportCosts");
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            for(var j=0;j<this.customersAmount; ++j)
            {
                console.log(this.transportCost[i][j]);
                console.log("\t");
            }
            console.log();
        }
        console.log();
    }

    printGainArr()
    {
        console.log("Gains");
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            for(var j=0;j<this.customersAmount; ++j)
            {
                console.log(this.gains[i][j]);
                console.log("\t");
            }
            console.log();
        }
        console.log();
    }

    printAlfasAndBetas()
    {
        console.log("Alfas");
        for(var i=0;i<this.suppliersAmount; ++i)
            console.log(this.alfas[i]);

        console.log("\nBetas");
        for(var i=0;i<this.customersAmount; ++i)
            console.log(this.betas[i] + "\t");
        console.log("\n");
    }

    printBase()
    {
        console.log("Base");
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            for(var j=0;j<this.customersAmount; ++j)
                console.log(this.base[i][j] + "\t");
            console.log();
        }
        console.log();
    }

    printDeltas()
    {
        console.log("Deltas");
        for(var i=0;i<this.suppliersAmount; ++i)
        {
            for(var j=0;j<this.customersAmount; ++j)
            {
                console.log(this.deltas[i][j]);
                console.log("\t");
            }
            console.log();
        }
        console.log();
    }

    printPath()
    {
        console.log("Path");
        for(var i=0;i<4;++i)
            console.log(this.path[i][0] + "\t" + this.path[i][1]);
            console.log();
    }

    printEvery()
    {
        for(var i=0; i<this.everyIteration.length; ++i)
        {
            for(var j=0; j<this.suppliersAmount; ++j)
            {
                for(var k=0; k<this.customersAmount; ++k)
                {
                    console.log(this.everyIteration[i][j][k] + "\t");
                }
                console.log();
            }
        }
        console.log();
    }
}

function Play(x, y) {
    var data =new Array[x];
    for (var i = 1; i < x + 1; i++) {
        var tmp = new Array[y];
        for (var j = 1; j < y + 1; j++) {
            tmp[j - 1] = document.getElementById("Field" + (i - 1) + ',' + (j - 1)).value;
        }
    }
    console.log(data);
}


    console.log("START");
        var supp = 2, cust = 3;
        var transport = new Transport(supp, cust);
        transport.suppliers[0] = new Supplier(0, 20, 10);
        transport.suppliers[1] = new Supplier(1, 30, 12);

        transport.customers[0] = new Customer(0, 10, 30);
        transport.customers[1] = new Customer(1, 28, 25);
        transport.customers[2] = new Customer(2, 27, 30);

        transport.transportCost[0] = [8,14,17];
        transport.transportCost[1] = [12,9,19];

        transport.setup();
        // transport.printCustomers();
        // transport.printSuppliers();
        transport.maxMetode();
        transport.firstTime();
        console.log(transport.checkIfPositive());
        transport.goForIt();
        transport.getFinalGain();
        // transport.printDeals();
        // transport.printGainArr();

        transport.printTransportCosts();
        console.log('------------');
        transport.printDeltas();
        

        app.get('/dane', async (req,res) =>{
            var data = transport.getFinalGain();
            // data = data.toString();
            const myJSON = JSON.stringify(data);
            console.log(typeof myJSON);
            res.setHeader('Content-Type', 'application/json');

            res.send(myJSON);
        })

        app.get('/tabele', async(req,res)=>{
            var dane = transport.customers;
            const myJSON = JSON.stringify(dane);
            console.log(typeof myJSON);
            res.setHeader('Content-Type', 'application/json');
            res.send(myJSON);
        })


        app.get('/full', async(req,res)=>{
            var bleble = transport;
            const myJSON = JSON.stringify(bleble);
            console.log(myJSON.customersAmount);
            console.log(typeof myJSON);
            res.setHeader('Content-Type', 'application/json');
            res.send(myJSON);
            test = res.body;
            console.log(test);
        })

        app.post('/newdata', async(req,res) =>{
            const dane = req.body;
            console.log(typeof dane);
            console.log(req.body);


            
            const test = new Transport;
        
            res.send("ok");
            //const newObject = req.body;
            //req.body.customersAmount;
        })

        app.get('/', (req,res)=>{
            res.sendFile(__dirname+"/data/main.html");
            
        });

