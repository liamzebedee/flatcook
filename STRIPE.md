## STRIPE/payments
 - We use Stripe Connect to support the marketplace aspect of the application.
 - We create **managed accounts**, which are Accounts in Stripe that we solely manage for the user.
 - When Payments occur between our Managed Accounts, they incur a Stripe fee and an Application Fee
 - Transactions fees with Stripe are 30c+2.9% every transaction

Read this [Stripe recipie for an app](https://stripe.com/docs/recipes/on-demand-app) as background info.

Here's our proposed payments flow:
 1. Open a special payments registration form (e.g. when users decide to go for a meal)
 2. Enter details - Name, Address, DOB. Also they mention "Again, the contractor would also need to formally agree to Stripe’s terms of service, and you would note the timestamp and the contractor’s IP address as a record of that÷"
 3. Submit to server -

 ```
 curl https://api.stripe.com/v1/accounts \
   -u {YOUR_SECRET_KEY}: \
   -d managed=true \
   -d country=AU \

   -d legal_entity[type]=individual \
   -d legal_entity[first_name]=Jane \
   -d legal_entity[last_name]=Doe \
   -d legal_entity[address][city]="San Francisco" \

   -d "/* Other address fields */" \
   -d legal_entity[dob][day]=31 \
   -d legal_entity[dob][month]=12 \
   -d legal_entity[dob][year]=1969 \

   -d tos_acceptance[date]=1453296505 \
   -d tos_acceptance[ip]="8.8.8.8"
 ```
 4. Stripe replies:
 	The result of a successful API call will be the account information (not all fields are shown):

```
{
  "id": "acct_12QkqYGSOD4VcegJ",
  "keys": {
    "secret": "sk_live_AxSI9q6ieYWjGIeRbURf6EG0",
    "publishable": "pk_live_h9xguYGf2GcfytemKs5tHrtg"
  },
  "managed": true,
  "charges_enabled": true,
  "transfers_enabled": false,
  ...
  "legal_entity": {
    ...
    "verification": {
      "status": "pending",
      ...
    }
  },
  "verification": {
    "fields_needed": ['bank_account'],
    "due_by": null,
    "contacted": false
  }
}
```

## Attaching payment methods
Then we need to get their payment details (VISA). Stripe facilitates this through creating a Customer object in our platform account, which means we can charge them automatically without them having to re-enter VISA details.

> "Stripe tokens can only be used once, but that doesn't mean you have to request your customer's card details for every payment. Stripe provides a Customer object type that makes it easy to save this—and other—information for later use."

Firstly on the front-end we take the VISA details through a form, and securely post it to Stripe's servers using Stripe.js.

```
Stripe.card.createToken({
  number: $('.card-number').val(),
  cvc: $('.card-cvc').val(),
  exp_month: $('.card-expiry-month').val(),
  exp_year: $('.card-expiry-year').val(),
  cvc: ,
}, stripeResponseHandler);

function stripeResponseHandler(status, response) {
  var $form = $('#payment-form');

  if (response.error) {
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);


  } else {
    // response contains id and card, which contains additional card details
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and submit
    $form.get(0).submit();

  }
}
```

```
# Get the credit card details submitted by the form
token = params[:stripeToken]

# Set our secret key so the customer is created on our account
Stripe.api_key = "sk_test_BQokikJOvBiI2HlWgH4olfQ2"

# Create a Customer
customer = Stripe::Customer.create(
  :source => token,
  :description => "Example customer"
)

# YOUR CODE: Save the customer ID and other info in a database for later!

# YOUR CODE: When it's time to charge the customer again, retrieve the customer ID!
```


## Processing payments
```
var guest, chef;

customer = guest.account.customerID;
destination = chef.accountID;

curl https://api.stripe.com/v1/charges \
   -u {YOUR_SECRET_KEY}: \
   -d amount=1000 \
   -d currency=aud \
   -d customer=cus_2qdw1rifqiei
   -d destination=acct_12QkqYGSOD4VcegJ \
   -d application_fee=200
```

## Withdrawing cash
Chef accounts need to have a bank account associated with them [like so](https://stripe.com/docs/stripe.js#collecting-bank-account-details).

```
Stripe.bankAccount.createToken({
  country: $('.country').val(),
  currency: $('.currency').val(),
  routing_number: $('.routing-number').val(),
  account_number: $('.account-number').val(),
  name: $('.name').val(),
  account_holder_type: $('.account_holder_type').val()
}, stripeResponseHandler);
```
with response:

```
{
  id: "tok_u5dg20Gra", // String of token identifier
  bank_account: { // Dictionary of the bank account used to create the token
    country: "US",
    bank_name: "BANK OF AMERICA, N.A",
    last4: "6789",
    validated: false,
    object: "bank_account",
  },
  created: 1453692792, // Integer of date token was created
  livemode: true, // Boolean of whether this token was created with a live or test API key
  type: "bank_account",
  object: "token", // String identifier of the type of object, always "token"
  used: false // Boolean of whether this token has been used
}
```

Then attach the bank account to their account:
```
curl https://api.stripe.com/v1/accounts/acct_12QkqYGSOD4VcegJ \
   -u {YOUR_SECRET_KEY}: \
   -d bank_account={TOKEN}
```

and response:

```
{
  ...
  "transfers_enabled": true,
  ...
}
```

payment schedule:

```
curl https://api.stripe.com/v1/accounts/acct_12QkqYGSOD4VcegJ \
   -u {YOUR_SECRET_KEY}: \
   -d transfer_schedule[interval]=weekly \
   -d transfer_schedule[weekly_anchor]=thursday
```