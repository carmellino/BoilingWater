import java.util.ArrayList;
import java.util.List;

public class Transport 
{
    int suppliersAmount, customersAmount;
    double supply=0.0, demand=0.0;

    Supplier[] suppliers;
    Customer[] customers;
    Broker broker;

    double[][] transportCost;
    double[][] gains;
    double[][] deals;
    boolean[][] base;
    double[][] deltas;
    int[][] path = new int[4][2];
    double[] alfas;
    double[] betas;

    List<int[]> checked = new ArrayList<int[]> (); 
    List<double[][]> everyIteration = new ArrayList<double[][]> (); 


    Transport(int a, int b)
    {   
        suppliersAmount = a;
        customersAmount = b;
        suppliers = new Supplier[a];
        customers = new Customer[b];
        transportCost = new double[a][b];
        gains = new double[suppliersAmount][customersAmount];
        for(int i=0;i<4;++i)
        {
            path[i][0] = -1;
            path[i][1] = -1;
        }
        
    }

    void calculateSupply()
    {
        supply = 0.0;
        for(int i=0;i<suppliersAmount;++i)
            supply += suppliers[i].supply;
    }

    void calculateDemand()
    {
        demand = 0.0;
        for(int i=0;i<customersAmount; ++i)
            demand += customers[i].demand;
    }

    void getFictional()
    {
        if(supply != demand)
        {
            suppliersAmount +=1;
            customersAmount +=1;
            Supplier newSuppliers[] = new Supplier[suppliersAmount];
            Customer newCustomers[] = new Customer[customersAmount];
            double newtransportCost[][] = new double[suppliersAmount][customersAmount];
            double newGains[][] = new double[suppliersAmount][customersAmount];

            for(int i=0;i<suppliersAmount-1;++i)
                newSuppliers[i] = suppliers[i];

            for(int i=0;i<customersAmount-1;++i)
                newCustomers[i] = customers[i];

            if(supply > demand)
            {
                newSuppliers[suppliersAmount-1] = new Supplier(suppliersAmount-1, 0,0);
                newCustomers[customersAmount-1] = new Customer(customersAmount-1, supply-demand,0);
            }
            else
            {
                newSuppliers[suppliersAmount-1] = new Supplier(suppliersAmount-1, demand-supply,0);
                newCustomers[customersAmount-1] = new Customer(customersAmount-1, 0,0);
            }
            customers = newCustomers;
            suppliers = newSuppliers;

            for(int i=0;i<suppliersAmount; ++i)
                for(int j=0;j<customersAmount; ++j)
                    newtransportCost[i][j] = 0;

            for(int i=0;i<suppliersAmount-1; ++i)
                for(int j=0;j<customersAmount-1; ++j)
                    newtransportCost[i][j] = transportCost[i][j];
            transportCost = newtransportCost;

            for(int i=0;i<suppliersAmount; ++i)
                for(int j=0;j<customersAmount; ++j)
                newGains[i][j] = 0;

            for(int i=0;i<suppliersAmount-1; ++i)
                for(int j=0;j<customersAmount-1; ++j)
                newGains[i][j] = gains[i][j];
                gains = newGains;
        }

    }

    void calculateGains()
    {
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                gains[i][j] = customers[j].sellingCost - transportCost[i][j] - suppliers[i].buyingCost;

    }
    
    void getFinalGain()
    {
        double finalGain = 0;
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                finalGain += deals[i][j] * gains[i][j];

        System.out.println("FinalGain: " + finalGain);
    }
    
    double getMinDeal()
    {
        double min=0, deal=0;
        for(int i=0;i<suppliersAmount; ++i)
        {
            if(suppliers[i].available == 0)
                continue;

            for(int j=0;j<customersAmount; ++j)
            {
                if(customers[j].available == 0)
                    continue;

                if(customers[j].available > suppliers[i].available)
                    deal = suppliers[i].available * gains[i][j];

                else
                    deal = customers[j].available * gains[i][j];

                if(deal < min)
                    min = deal;
            }
        }
        return min;
    }

    void maxMetode()
    {
        initDealsArr();

        double minDeal = 0, max=0, deal=0, amount =0, maxAmount =0;
        int maxCustId=0, maxSuppId=0;
        boolean change = false;
        minDeal = getMinDeal();
        for(int k = 0; k < suppliersAmount * customersAmount; ++k)
        {
            max = minDeal;
            change = false;
            for(int i=0;i<suppliersAmount; ++i)
            {
                if(suppliers[i].available == 0)
                    continue;

                for(int j=0;j<customersAmount; ++j)
                {
                    if(customers[j].available == 0)
                        continue;

                    if(customers[j].available > suppliers[i].available)
                    {
                        deal = suppliers[i].available * gains[i][j];
                        amount = suppliers[i].available;
                    }
        
                    else
                    {
                        deal = customers[j].available * gains[i][j];
                        amount = customers[j].available;
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
                deals[maxSuppId][maxCustId] = maxAmount;

                if(customers[maxCustId].available > suppliers[maxSuppId].available)
                {
                    customers[maxCustId].available -= suppliers[maxSuppId].available;
                    suppliers[maxSuppId].available -= suppliers[maxSuppId].available;
                }
                else
                {
                    suppliers[maxSuppId].available -= customers[maxCustId].available;
                    customers[maxCustId].available -= customers[maxCustId].available;
                }
            }
                
        }
    }

    void initAlfasAndBetas()
    {
        alfas = new double[suppliersAmount];
        betas = new double[customersAmount];
        
        for(int i=0;i<suppliersAmount; ++i)
            alfas[i] = 0;

        for(int i=0;i<customersAmount; ++i)
            betas[i] = 0;
    }

    void initDealsArr()
    {
        deals = new double[suppliersAmount][customersAmount];
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                deals[i][j] = 0;
    }

    void calculateAlfasAndBetas()
    {
        if(suppliersAmount > customersAmount)
        {
            int alfaId = suppliersAmount-1;
            for(int i=customersAmount-1; i>=0; --i)
            {
                betas[i] = transportCost[alfaId][i] - alfas[alfaId];
                alfaId--;
                alfas[alfaId] = transportCost[alfaId][i] - betas[i];
            }
            for(int i=alfaId; i>=0; --i)
            {
                alfas[i] = transportCost[i][0] - betas[0];
            }
        }
        else
        {
            int betaId = customersAmount-1;
            for(int i=suppliersAmount-1; i>0; --i)
            {
                betas[betaId] = transportCost[i][betaId] - alfas[i];
                alfas[i-1] = transportCost[i-1][betaId] - betas[betaId];
                betaId--;
            }
            for(int i=betaId; i>=0; --i)
            {
                betas[i] = transportCost[0][i] - alfas[0];
            }
        }
    }

    void initBaseArr()
    {
        base = new boolean[suppliersAmount][customersAmount];
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                base[i][j] = false;
    }

    void getBase()
    {
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                if(deals[i][j] != 0)
                    base[i][j] = true;
    }

    void initDeltasArr()
    {
        deltas = new double[suppliersAmount][customersAmount];
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                deltas[i][j] = 0;
    }

    void calculateDeltas()
    {
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                if(!base[i][j])
                    deltas[i][j] = transportCost[i][j] - alfas[i] - betas[j];
                else
                    deltas[i][j] = 0;
    }

    boolean checkIfPositive()
    {
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                if(!base[i][j])
                    if(deltas[i][j] > 0)
                        return true;
        return false;
    }

    void findAndSetMaxDelta()
    {
        
        double max = 0;
        int maxI = -1, maxJ = -1;
        boolean inList = false;
        for(int i=0;i<suppliersAmount; ++i)
            for(int j=0;j<customersAmount; ++j)
                if(deltas[i][j] > max)
                {
                    for(int k=0;k<checked.size();++k)
                    {
                        if(checked.get(k)[0] == i && checked.get(k)[1] == j)
                            inList = true;
                    }
                    if(!inList)
                    {
                        max = deltas[i][j];
                        maxI = i;
                        maxJ = j;
                    }
                    else
                        inList = false;
                }
                    
        path[0][0] = maxI;
        path[0][1] = maxJ;
        checked.add(path[0]);
    }

    void setPath()
    {   
        findAndSetMaxDelta();
        while( path[0][0] != -1 )
        {
            for(int i=0;i<suppliersAmount; ++i)
            {
                if(base[i][path[0][1]] && i != path[0][0])
                {
                    for(int j=0;j<customersAmount; ++j)
                    {
                        if(base[i][j] && j != path[0][1])
                        {
                            if(base[path[0][0]][j])
                            {
                                path[1][0] = i;
                                path[1][1] = path[0][1];

                                path[2][0] = i;
                                path[2][1] = j;
                                
                                path[3][0] = path[0][0];
                                path[3][1] = j;

                                checked.clear();
                                return;
                            }
                        }
                    }
                }
            }
            findAndSetMaxDelta();
        }
    }

    double getMinInPath()
    {
        double min = deals[path[1][0]][path[1][1]];

        if(deals[path[2][0]][path[2][1]] < min)
            min = deals[path[2][0]][path[2][1]];

        if(deals[path[3][0]][path[3][1]] < min)
            min = deals[path[3][0]][path[3][1]];

        return min;
    }

    void relocate()
    {
        double val = getMinInPath();
        deals[path[0][0]][path[0][1]] += val;
        deals[path[1][0]][path[1][1]] -= val;
        deals[path[2][0]][path[2][1]] += val;
        deals[path[3][0]][path[3][1]] -= val;
        getBase();
    }

    void change()
    {
        setPath();
        if(path[0][0] == -1)
            return;
            
        relocate();
        calculateAlfasAndBetas();
        calculateDeltas();
    }

    void goForIt()
    {
        while(checkIfPositive())
        {
            change();
            if(path[0][0] == -1)
                return;
            
            printDeals();
            printDeltas();
            printBase();
            everyIteration.add(deals);
        }
    }

    void setup()
    {
        calculateDemand();
        calculateSupply();
        calculateGains();
        getFictional();
    }


    void firstTime()
    {
        initAlfasAndBetas();
        calculateAlfasAndBetas();

        initBaseArr();
        getBase();

        initDeltasArr();
        calculateDeltas();
    }

    void printDeals()
    {
        System.out.println("Deals");
        for(int i=0;i<suppliersAmount; ++i)
        {
            for(int j=0;j<customersAmount; ++j)
            {
                System.out.print(deals[i][j]);
                System.out.print("\t");
            }
            System.out.println();
        }
        System.out.println();
    }

    void printCustomers()
    {
        System.out.println("Customers");
        System.out.println("id\tdemand\tsCost\tavailible");
        for(int i=0;i<customersAmount; ++i)
        {
            System.out.print(customers[i].id + "\t");
            System.out.print(customers[i].demand + "\t");
            System.out.print(customers[i].sellingCost + "\t");
            System.out.print(customers[i].available);
            System.out.println();
        }
        System.out.println();
    }

    void printSuppliers()
    {
        System.out.println("Suppliers");
        System.out.println("id\tdemand\tbCost\tavailible");
        for(int i=0;i<suppliersAmount; ++i)
        {
            System.out.print(suppliers[i].id + "\t");
            System.out.print(suppliers[i].supply + "\t");
            System.out.print(suppliers[i].buyingCost + "\t");
            System.out.print(suppliers[i].available);
            System.out.println();
        }
        System.out.println();
    }

    void printTransportCosts()
    {
        System.out.println("TransportCosts");
        for(int i=0;i<suppliersAmount; ++i)
        {
            for(int j=0;j<customersAmount; ++j)
            {
                System.out.print(transportCost[i][j]);
                System.out.print("\t");
            }
            System.out.println();
        }
        System.out.println();
    }

    void printGainArr()
    {
        System.out.println("Gains");
        for(int i=0;i<suppliersAmount; ++i)
        {
            for(int j=0;j<customersAmount; ++j)
            {
                System.out.print(gains[i][j]);
                System.out.print("\t");
            }
            System.out.println();
        }
        System.out.println();
    }

    void printAlfasAndBetas()
    {
        System.out.println("Alfas");
        for(int i=0;i<suppliersAmount; ++i)
            System.out.println(alfas[i]);

        System.out.println("\nBetas");
        for(int i=0;i<customersAmount; ++i)
            System.out.print(betas[i] + "\t");
        System.out.println("\n");
    }

    void printBase()
    {
        System.out.println("Base");
        for(int i=0;i<suppliersAmount; ++i)
        {
            for(int j=0;j<customersAmount; ++j)
                System.out.print(base[i][j] + "\t");
            System.out.println();
        }
        System.out.println();
    }

    void printDeltas()
    {
        System.out.println("Deltas");
        for(int i=0;i<suppliersAmount; ++i)
        {
            for(int j=0;j<customersAmount; ++j)
            {
                System.out.print(deltas[i][j]);
                System.out.print("\t");
            }
            System.out.println();
        }
        System.out.println();
    }

    void printPath()
    {
        System.out.println("Path");
        for(int i=0;i<4;++i)
            System.out.println(path[i][0] + "\t" + path[i][1]);
            System.out.println();
    }
}
