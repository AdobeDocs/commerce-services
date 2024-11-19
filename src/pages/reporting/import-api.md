---
title: Adobe Commerce Reporting Import API | Commerce Services
description: Learn how to push arbitrary data into your data warehouse using REST.
keywords:
  - Reporting
  - REST
  - Services
---

# Import API

The Adobe Commerce Reporting Import API allows you to push arbitrary data into your data warehouse using REST.

Before using the import API, make sure you [authenticate](../reporting/index.md#authentication) your connection.

## Return Codes

The Data Import API uses standard HTTP return codes to indicate the status of a request. Your application should handle each of the following return statuses.

Codes in the 2xx range indicate a successful transaction, codes in the 4xx range indicate a bad request, and codes in the 5xx range indicate an error with Adobe Commerce Reporting. If errors in the 5xx range persist, please contact [support](https://experienceleague.adobe.com/docs/commerce-knowledge-base/kb/help-center-guide/magento-help-center-user-guide.html).

*  200 OK - request was successful.
*  201 Created - new data was added as a result of the request.
*  400 Bad request - Your request was missing a required parameter.
*  401 Unauthorized - Authorization failed. Double check your API key.
*  404 Not Found - The resource you are looking for does not exist.
*  500 Server Error - There is an error in Adobe Commerce Reporting.

## Versioning

The current version of the Import API is v2.

v1 is still available, but will be deprecated in the future.

## Test environment

The Data Import API has a full test (sandbox) environment.

The sandbox environment uses the same keys and return codes as the production API, but does not persist incoming data. You can use this environment to test your integration.

```bash
curl -v https://sandbox-connect.rjmetrics.com/v2/client/:cid/:endpoint?apikey=:apikey
```

## Methods

### Status

You can always check the status of the Data Import API. This is called when you instantiate the client. This will return a `200-Success` response if the API is operational.

```bash
curl -v https://connect.rjmetrics.com
```

### Upsert

The upsert method allows you to push data into your RJMetrics data warehouse. You can push entire arrays of data or single data points. This endpoint will only accept data that have the following properties:

*  The data must be valid JSON.
*  Each data point must contain a `keys` field. The `keys` field should specify which fields in the records represent the primary key(s).
*  An array of data must contain no more than 100 individual data points.

<InlineAlert variant="warning" slots="text" />

Each data point in your data warehouse will be uniquely indexed by the fields specified in `keys`. If a new data point has keys that conflict with a pre-existing data point, the old data point will be replaced.

Tables in the Data Import API are schemaless. There is no command to create or destroy a table - you can push data to any table name and it will be dynamically generated.

Here are some guidelines for managing tables:

*  Create one table for each type of data point you are pushing.
*  Generally speaking, each data point pushed into a table should have the same schema.
*  Typically, one type of 'thing' will correspond to one table. For example, a typical eCommerce company might have a 'customer', 'order', 'order_item', and 'product' table.
*  Table names must be alphanumeric (plus underscores). Bad table names will result in a `400 Bad Request` return code.

Here's an example of an Upsert call:

```bash
curl -X POST -d @filename https://connect.rjmetrics.com/v2/client/:cid/table/:table/data?apikey=:apikey --header "Content-type: application/json"
```

The above call contains the following variables:

`@filename` - name of the file you are uploading
`:cid` - your client Id
`:table` - table name
`:apikey` - your API key

**Response:**

```json
"status": "complete",
"created_at": "2019-08-05 04:51:02"
client.push_data(
    "table_name",
    test_data
)
```

### Upsert single data point example

```json
{
  "keys": ["id"],
  "id": 1,
  "email": "joe@schmo.com",
  "status": "pending",
  "created_at": "2019-08-01 14:22:32"
}
```

### Upsert array of data points example

```json
[{
  "keys": ["id"],
  "id": 1,
  "email": "joe@schmo.com",
  "status": "pending",
  "created_at": "2019-08-01 14:22:32"
},{
  "keys": ["id"],
  "id": 2,
  "email": "anne@schmo.com",
  "status": "pending",
  "created_at": "2019-08-03 23:12:30"
},{
  "keys": ["id"],
  "id": 1,
  "email": "joe@schmo.com",
  "status": "complete",
  "created_at": "2019-08-05 04:51:02"
}]
```

## Additional Examples

The following section describes how you can call the import API through various libraries to perform the following tasks:

*  Create a Users Table
*  Create an Orders Table

### Create a users table

Your most important table in Adobe Commerce Reporting is your `Users` table. In your application, you probably have a `user` object with some data like `id`, `email`, and `acquisition_source`.

This examples describes how to push this data to the Import API.

First, define a template to push the data. Ensure the client is `authenticated <api-authentication>` and prepare to push the data to the Import API.

<CodeBlock slots="heading, code" repeat="5" languages="JS, PHP, Clojure, Ruby, Python" />

#### Javascript

```js
var rjmetrics = require("rjmetrics");
client = new rjmetrics.Client(your-client-id, "your-api-key");

// make sure the client is authenticated before we do anything
client.authenticate().then( function(data) {
  // this is where we'll push the data
}).fail(function(err) {
  console.error("Failed to authenticate!");
});
```

#### PHP

```php
require 'vendor/autoload.php';
$client = new RJMetrics\Client($your-client-id, "your-api-key");

// make sure the client is authenticated before we do anything
if($client->authenticate()) {
  // this is where we'll push the data
}
```

#### Clojure

```clojure
(ns examples.acquisition-source
  (:require [rjmetrics.core :as rjmetrics]))

(defn run
  []
  (let [config {:client-id your-client-id :api-key "your-api-key"}]
    (when (rjmetrics/authenticated? config)
      ;; this is where we'll push data
    )
  )
)
```

#### Ruby

```ruby
require "rjmetrics_client"
client = RJMetricsClient.new(your-client-id, "your-api-key")

# make sure the client is authenticated before we do anything
if client.authenticated?
  # this is where we'll push data
end
```

#### Python

 ```python
import rjmetrics.client
client = rjmetrics.client.Client(your_client_id, "your_api_key")

# make sure the client is authenticated before we do anything
if client.authenticate()
  # this is where we'll push data
```

Next, create a new function to sync the new data.

<CodeBlock slots="heading, code" repeat="5" languages="JS, PHP, Clojure, Ruby, Python" />

#### Javascript

```js
function syncUser(client, user) {
  return client.pushData(
    // table named "users"
    "users",
    {
      // user_id is the unique key here, since each user should only
      // have one record in this table
      "keys": ["id"],
      "id": user.id,
      "email": user.email,
      "acquisition_source": user.acquisition_source
    });
}
```

#### PHP

```php
function syncUser($client, $user) {
  $dataToPush = new stdClass();
  $dataToPush->id = $user->id;
  $dataToPush->email = $user->email;
  $dataToPush->acquisition_source = $user->acquisitionSource;
  // user_id is the unique key here, since each user should only
  // have one record in this table
  $dataToPush->keys = array("id");

  // table named "users"
  return $client->pushData("users", $dataToPush);
}
```

#### Clojure

```clojure
(defn- sync-user
  [config user]
  (let [result (rjmetrics/push-data config
                                    ;; table named "users"
                                    "users"
                                    ;; user_id is the unique key here, since each user
                                    ;; should only have one record in the table
                                    (assoc user :keys ["id"]))]
    (if (= (-> result first :status) 201)
        (print "Synced user with id" (:id user) "\n")
        (print "Failed to sync user with id" (:id user) "\n"))))
```

#### Ruby

```ruby
def sync_user(client, user)
  # `id` is the unique key here, since each user should only
  # have one record in this table
  user[:keys] = [:id]
  # table named "users"
  return client.pushData("users", user)
end
```

#### Python

```python
def sync_user(client, user):
  # `id` is the unique key here, since each user should only
  # have one record in this table
  user["keys"] = ["id"]
  # table named "users"
  return client.push_data("users", [user]) # NOTE: the python library only pushes lists
```

Finally, incorporate the `syncUser` function into the original script.

<CodeBlock slots="heading, code" repeat="5" languages="JS, PHP, Clojure, Ruby, Python" />

#### Javascript

```js
var rjmetrics = require("rjmetrics");
var client = new rjmetrics.Client(your-client-id, "your-api-key");

function syncUser(client, user) {
  return client.pushData(
    // table named "users"
    "users",
    {
      // user_id is the unique key here, since each user should only
      // have one record in this table
      "keys": ["id"],
      "id": user.id,
      "email": user.email,
      "acquisition_source": user.acquisition_source
    });
}

// let's define some fake users
var users = [
  {id: 1, email: "joe@schmo.com", acquisition_source: "PPC"},
  {id: 2, email: "mike@smith.com", acquisition_source: "PPC"},
  {id: 3, email: "lorem@ipsum.com", acquisition_source: "Referral"},
  {id: 4, email: "george@vandelay.com", acquisition_source: "Organic"},
  {id: 5, email: "larry@google.com", acquisition_source: "Organic"},
];

// make sure the client is authenticated before we do anything
client.authenticate().then( function(data) {

  // iterate through users and push data
  users.forEach( function(user) {
    syncUser(client, user).then( function(data) {
      console.log("Synced user with id " + user.id);
    }, function(error) {
      console.error("Failed to sync user with id " + user.id);
    })
  });

}).fail(function(err) {
  console.error("Failed to authenticate!");
});
```

#### PHP

```php
require 'vendor/autoload.php';
$client = new RJMetrics\Client($your-client-id, "your-api-key");

function syncUser($client, $user) {
  $dataToPush = new stdClass();
  $dataToPush->id = $user->id;
  $dataToPush->email = $user->email;
  $dataToPush->acquisition_source = $user->acquisitionSource;
  // user_id is the unique key here, since each user should only
  // have one record in this table
  $dataToPush->keys = array("id");

  // table named "users"
  return $client->pushData("users", $dataToPush);
}

// let's define some fake users
function fakeUserGenerator($id, $email, $acquisitionSource) {
  $toReturn = new stdClass();

  $toReturn->id = $id;
  $toReturn->email = $email;
  $toReturn->acquisitionSource = $acquisitionSource;

  return $toReturn;
}

$users = array(
  fakeUserGenerator(1, "joe@schmo.com", "PPC"),
  fakeUserGenerator(2, "mike@smith.com", "PPC"),
  fakeUserGenerator(3, "lorem@ipsum.com", "Referral"),
  fakeUserGenerator(4, "george@vandelay.com", "Organic"),
  fakeUserGenerator(5, "larry@google.com", "Organic"),
);

// make sure the client is authenticated before we do anything
if($client->authenticate()) {
  // iterate through users and push data
  foreach($users as $user) {
    $responses = syncUser($client, $user);

    // api calls always return an array of responses
    foreach($responses as $response) {
      if($response->code == 201)
        print("Synced user with id {$user->id}\n");
      else
        print("Failed to sync user with id {$user->id}\n");
    }
  }
}
```

#### Clojure

```clojure
(ns examples.acquisition-source
  (:require [rjmetrics.core :as rjmetrics]))

(defn- sync-user
  [config user]
  (let [result (rjmetrics/push-data config
                                    ;; table named "users"
                                    "users"
                                    ;; user_id is the unique key here, since each user
                                    ;; should only have one record in the table
                                    (assoc user :keys ["id"]))]
    (if (= (-> result first :status) 201)
        (print "Synced user with id" (:id user) "\n")
        (print "Failed to sync user with id" (:id user) "\n"))))

(defn run
  []
  (let [config {:client-id your-client-id :api-key "your-api-key"}
        ;; let's define some fake users
        users [{:id 1, :email "joe@schmo.com", :acquisition_source "PPC"}
                {:id 2, :email "mike@smith.com", :acquisition_source "PPC"}
                {:id 3, :email "lorem@ipsum.com", :acquisition_source "Referral"}
                {:id 4, :email "george@vandelay.com", :acquisition_source "Organic"}
                {:id 5, :email "larry@google.com", :acquisition_source "Organic"}]]
    ;; make sure the client is authenticated before we do anything
    (when (rjmetrics/authenticated? config)
      ;; iterate through users and push data
      (dorun (map (partial sync-user config) users)))))
```

#### Ruby

```ruby
require "rjmetrics_client"
client = RJMetricsClient.new(your-api-key, "your-client-id")

# let's define some fake users
fake_users = [
  {:id => 1, :email => "joe@schmo.com", :acquisition_source => "PPC"},
  {:id => 2, :email => "mike@smith.com", :acquisition_source => "PPC"},
  {:id => 3, :email => "lorem@ipsum.com", :acquisition_source => "Referral"},
  {:id => 4, :email => "george@vandelay.com", :acquisition_source => "Organic"},
  {:id => 5, :email => "larry@google.com", :acquisition_source => "Organic"}
]

def sync_user(client, user)
  # `id` is the unique key here, since each user should only
  # have one record in this table
  user[:keys] = [:id]
  # table named "users"
  return client.pushData("users", user)
end

# make sure the client is authenticated before we do anything
if client.authenticated?
  fake_users.each do |user|
    # iterate through users and push data
    sync_user(client, user).each do |response|
      if response["code"]
        puts "Synced user with id #{user[:id]}"
      else
        puts "Failed to sync user with id #{user[:id]}"
      end
    end
  end
end
```

#### Python

```python
import rjmetrics.client

CLIENT_ID = 0000
API_KEY = 'your_api_key'

client = rjmetrics.client.Client(CLIENT_ID, API_KEY)

# let's define some fake users
fake_users = [
  {"id": 1, "email": "joe@schmo.com", "acquisition_source": "PPC"},
  {"id": 2, "email": "mike@smith.com", "acquisition_source": "PPC"},
  {"id": 3, "email": "lorem@ipsum.com", "acquisition_source": "Referral"},
  {"id": 4, "email": "george@vandelay.com", "acquisition_source": "Organic"},
  {"id": 5, "email": "larry@google.com", "acquisition_source": "Organic"}
]


def sync_user(client, user):
  # `id` is the unique key here, since each user should only
  # have one record in this table
  user["keys"] = ["id"]
  # table named "users"
  return client.push_data("users", [user])[0]


# make sure the client is authenticated before we do anything
if client.authenticate():
  for user in fake_users:
    # iterate through users and push data
    response = sync_user(client, user)
    if response.ok:
        print "Synced user with id ", user["id"]
    else:
        print "Failed to sync user with id ", user["id"]
```

This example is included with the [client libraries](libraries.md) or can be [downloaded from github](https://github.com/rjmetrics).

<CodeBlock slots="heading, code" repeat="5" languages="JS, PHP, Clojure, Ruby, Python" />

#### JavaScript

```bash
npm install
node users-table.js
```

#### PHP

```bash
composer install
php users-table.php
```

#### Clojure

```clojure
lein repl

> (ns examples.users-table)
> (require :reload 'examples.users-table)
> (run)
```

#### Ruby

```bash
bundle install
ruby users-table.rb
```

#### Python

```bash
pip install
python examples/users_table.py
```

### Create an orders table

Now, create an orders table with the following fields: `id`, `user_id`, `value` and `sku`.

Create a new function to push the order object:

<CodeBlock slots="heading, code" repeat="5" languages="JS, PHP, Clojure, Ruby, Python" />

#### Javascript

```js
function syncOrder(client, order) {
  return client.pushData(
    "orders",
    {
      "keys": ["id"],
      "id": order.id,
      "user_id": order.user_id,
      "value": order.value,
      "sku": order.sku
    });
}
```

#### PHP

```php
function syncOrder($client, $order) {
  $dataToPush = new stdClass();
  $dataToPush->id = $order->id;
  $dataToPush->user_id = $order->user_id;
  $dataToPush->value = $order->value;
  $dataToPush->sku = $order->sku;
  $dataToPush->keys = array("id");

  return $client->pushData("orders", $dataToPush);
}
```

#### Clojure

```clojure
(defn- sync-order
  [config order]
  (let [result (rjmetrics/push-data config
                                    "orders"
                                    (assoc order :keys ["id"]))]
    (if (= (-> result first :status) 201)
        (print "Synced order with id" (:id order) "\n")
        (print "Failed to sync order with id" (:id order) "\n"))))
```

#### Ruby

```ruby
def sync_order(client, order)
  order[:keys] = [:id]
  return client.pushData("orders", order)
end
```

#### Python

```python
def sync_order(client, order):
  order["keys"] = ["id"]
  return client.push_data("orders", [order])[0]
```

Now, plug this into the same template from the `users` table:

<CodeBlock slots="heading, code" repeat="5" languages="JS, PHP, Clojure, Ruby, Python" />

#### Javascript

```js
var rjmetrics = require("rjmetrics");
var client = new rjmetrics.Client(your-client-id, "your-api-key");

function syncOrder(client, order) {
  return client.pushData(
    "orders",
    {
      "keys": ["id"],
      "id": order.id,
      "user_id": order.user_id,
      "value": order.value,
      "sku": order.sku
    });
}

var orders = [
  {"id": 1, "user_id": 1, "value": 58.40,  "sku": "milky-white-suede-shoes"},
  {"id": 2, "user_id": 1, "value": 23.99,  "sku": "red-button-down-fleece"},
  {"id": 3, "user_id": 2, "value": 5.00,   "sku": "bottle-o-bubbles"},
  {"id": 4, "user_id": 3, "value": 120.01, "sku": "zebra-striped-game-boy"},
  {"id": 5, "user_id": 5, "value": 9.90  , "sku": "kitten-mittons"}
];

client.authenticate().then( function(data) {

  orders.forEach( function(order) {
    syncOrder(client, order).then( function(data) {
      console.log("Synced order with id " + order.id);
    }, function(error) {
      console.error("Failed to sync order with id " + order.id);
    })
  });

}).fail(function(err) {
  console.error("Failed to authenticate!");
});
```

#### PHP

```php
require 'vendor/autoload.php';
$client = new RJMetrics\Client($your-client-id, "your-api-key");

function syncOrder($client, $order) {
  $dataToPush = new stdClass();
  $dataToPush->id = $order->id;
  $dataToPush->user_id = $order->user_id;
  $dataToPush->value = $order->value;
  $dataToPush->sku = $order->sku;
  $dataToPush->keys = array("id");

  return $client->pushData("orders", $dataToPush);
}

function fakeOrderGenerator($id, $userId, $value, $sku) {
  $toReturn = new stdClass();

  $toReturn->id = $id;
  $toReturn->user_id = $userId;
  $toReturn->value = $value;
  $toReturn->sku = $sku;

  return $toReturn;
}

$orders = array(
  fakeOrderGenerator(1, 1, 58.40, "milky-white-suede-shoes"),
  fakeOrderGenerator(2, 1, 23.99, "red-buttons-down-fleece"),
  fakeOrderGenerator(3, 2, 5.00, "bottle-o-bubbles"),
  fakeOrderGenerator(4, 3, 120.01, "zebra-striped-game-boy"),
  fakeOrderGenerator(5, 5, 9.90, "kitten-mittons")
);

if($client->authenticate()) {
  foreach($orders as $order) {
    $responses = syncOrder($client, $order);

    foreach($responses as $response) {
      if($response->code == 201)
        print("Synced order with id {$order->id}\n");
      else
        print("Failed to sync order with id {$order->id}\n");
    }
  }
}
```

#### Clojure

```clojure
(ns examples.orders-table
  (:require [rjmetrics.core :as rjmetrics]))

(defn- sync-order
  [config order]
  (let [result (rjmetrics/push-data config
                                    "orders"
                                    (assoc order :keys ["id"]))]
    (if (= (-> result first :status) 201)
        (print "Synced order with id" (:id order) "\n")
        (print "Failed to sync orfer with id" (:id order) "\n"))))

(defn run
  []
  (let [config {:client-id your-client-id :api-key "your-api-key"}
        orders [{:id 1, :user_id 1 :value 58.40  :sku "milky-white-suede-shoes"}
                {:id 2, :user_id 1 :value 23.99  :sku "red-button-down-fleece"}
                {:id 3, :user_id 2 :value 5.00   :sku "bottle-o-bubbles"}
                {:id 4, :user_id 3 :value 120.01 :sku "zebra-striped-game-boy"}
                {:id 5, :user_id 5 :value 9.90   :sku "kitten-mittons"}]]
    (when (rjmetrics/authenticated? config)
      (dorun (map (partial sync-order config) users)))))
```

#### Ruby

```ruby
require "rjmetrics_client"
client = RJMetricsClient.new(your-client-id, "your-api-key")

fake_orders = [
  {:id => 1, :user_id => 1, :value => 58.40,  :sku => "milky-white-suede-shoes"},
  {:id => 2, :user_id => 1, :value => 23.99,  :sku => "red-button-down-fleece"},
  {:id => 3, :user_id => 2, :value => 5.00,   :sku => "bottle-o-bubbles"},
  {:id => 4, :user_id => 3, :value => 120.01, :sku => "zebra-striped-game-boy"},
  {:id => 5, :user_id => 5, :value => 9.90,   :sku => "kitten-mittons"}
]

def sync_order(client, order)
  order[:keys] = [:id]
  return client.pushData("orders", order)
end

if client.authenticated?
  fake_orders.each do |order|
    sync_order(client, order).each do |response|
      if response["code"]
        puts "Synced order with id #{order[:id]}"
      else
        puts "Failed to sync order with id #{order[:id]}"
      end
    end
  end
end
```

#### Python

```python
import rjmetrics.client

CLIENT_ID = 0000
API_KEY = 'your_api_key'

client = rjmetrics.client.Client(CLIENT_ID, API_KEY)

fake_orders = [
  {"id": 1, "user_id": 1, "value": 58.40,  "sku": "milky-white-suede-shoes"},
  {"id": 2, "user_id": 1, "value": 23.99,  "sku": "red-button-down-fleece"},
  {"id": 3, "user_id": 2, "value": 5.00,   "sku": "bottle-o-bubbles"},
  {"id": 4, "user_id": 3, "value": 120.01, "sku": "zebra-striped-game-boy"},
  {"id": 5, "user_id": 5, "value": 9.90,   "sku": "kitten-mittons"}
]


def sync_order(client, order):
  order["keys"] = ["id"]
  return client.push_data("orders", [order])[0]


# make sure the client is authenticated before we do anything
if client.authenticate():
  for order in fake_orders:
    # iterate through users and push data
    response = sync_order(client, order)
    if response.ok:
        print "Synced order with id ", order["id"]
    else:
        print "Failed to sync order with id ", order["id"]
```
