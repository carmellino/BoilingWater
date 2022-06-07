

public class Main
{
    public static void main(String[] args) 
    {
        System.out.println("START");
        
        //hardcore data
        int supp = 2, cust = 3;
        Transport transport = new Transport(supp, cust);
        transport.suppliers[0] = new Supplier(0, 20, 10);
        transport.suppliers[1] = new Supplier(1, 30, 12);

        transport.customers[0] = new Customer(0, 10, 30);
        transport.customers[1] = new Customer(1, 28, 25);
        transport.customers[2] = new Customer(2, 27, 30);

        transport.transportCost[0][0] = 8;
        transport.transportCost[0][1] = 14;
        transport.transportCost[0][2] = 17;
        transport.transportCost[1][0] = 12;
        transport.transportCost[1][1] = 9;
        transport.transportCost[1][2] = 19;


        

        transport.setup();
        // transport.printCustomers();
        // transport.printSuppliers();
        // transport.printTransportCosts();
        // transport.printGainArr();

        transport.maxMetode();

        // System.out.println("\nvalues after maxMetode()");
        // transport.printDeals();
        // transport.printCustomers();
        // transport.printSuppliers();
        transport.printDeals();
        transport.firstTime();
        
        //transport.printAlfasAndBetas();

        

        //transport.printBase();

       

        //transport.printDeltas();

        System.out.println(transport.checkIfPositive());
        //transport.printPath();
        //transport.setPath();
        //transport.printPath();
        //transport.printDeals();
        transport.printDeals();
        transport.goForIt();
        transport.getFinalGain();
        transport.printDeals();
        transport.printDeltas();
        transport.printGainArr();;
        transport.printTransportCosts();
    }
}
