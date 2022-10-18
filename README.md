# Koopon


KOOPON provides service providers and manufacturers with a way to reward their clients in a cost-effective manner as well as provide coupon holders with the option of trading these coupons. It is a win-win situation. Service providers have a way of keeping customers coming back, and customers/clients get rewarded and can trade for other coupons they desire.
To enable providers and manufacturers reward their clients, we provide a way for these businesses to mint coupons created as NFTs, which can be sent to customers via Whatsapp, exchanged, traded, bid etc...

KOOPON is built on MINTBASE API enabling any business create, mint and list NFTs.




| s/n | Content |
| ------ | ------ |
|1| Product Design(UI/UX) 
|2| Definition and structuring of smart contracts and business logic 
|3| Backend development 
|4| Front End App Design 
|5| Connecting the Frontend to the Backend 
|6| Mock data load and validation testing 
|7| Heuristic Evaluation 
|8| Deploy on TestNet 

## Features
The product enables businesses to reward their customers, listed below are the features driving the application:
- Create unminted coupons
- Minting 
- Listing
- Transfer
- Raffles
- Auctions



## 1. Product Design(UI/UX)
The current version of the application is running on [https://koopon-puce.vercel.app/]. However, the product is being upgraded to a have a new design, feel and aesthetic. Below are some of the images, click this link: [https://www.figma.com/file/WHnX8JgYYszodCTIp1fgMW/Koopon?node-id=134%3A1576] to view the full design for the upgrade.

<img src="https://res.cloudinary.com/gosa-2013/image/upload/v1666093167/Desktop_-_2_tmz9jw.png" />


## 2. Definition and structuring of smart contracts and business logic 
Most of the features listed above require a contract deployed on a chain to allow features like `minting`, `listing `, `transfer` etc. to happen. In the bid to make an MVP to proof the concept, koopon was built on MINTBASE API which already deployed contracts that are sufficient to build an MVP.
Therefore, the application is partially decentralized application (dApp) because it also leverages on the Koopon API to achieve some implementation of its feaures.

<img src="https://res.cloudinary.com/gosa-2013/image/upload/v1666092048/KOOPON_pjmekq.jpg" />


## 3. Backend development 
The backend development of the project uses Nodejs, Typescript and NoSQL databse (MongoDB) to deliver a secure and fast RESTful API to support features of the application.



## 4. Front End App Design
Mintbase have created a boilerplate to build on top of the exposed APIs, the technologies used are Nextjs  and Typescript.

## 5. Connecting the Frontend to the Backend 
Koopon application frontend and backend are connected via RESTful APIs created at the backend. #2 contains the application architectural diagram to have an overview of how the parts are coupled. Also here is a link to the API documentation of the application: [https://documenter.getpostman.com/view/8893798/2s847FuZD1#a0ba265b-9d0a-4c24-924e-8b27be4ac233]