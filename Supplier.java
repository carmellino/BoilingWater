public class Supplier 
{
    int id;
    double supply, available;
    double buyingCost;

    Supplier(int a, double b, double c)
    {
        id = a;
        supply = b;
        available = b;
        buyingCost = c;
    }
    void subtractFromAvailable(double a)
    {
        available -= a;
    }
}
