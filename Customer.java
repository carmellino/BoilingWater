public class Customer 
{
    int id;
    double demand, available;
    double sellingCost;

    Customer(int a, double b, double c)
    {
        id = a;
        demand = b;
        available = b;
        sellingCost = c;
    }
    void subtractFromAvailable(double a)
    {
        available -= a;
    }
}
