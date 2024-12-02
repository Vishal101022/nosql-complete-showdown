# Full Stack Expense App
## :grey_question: what it does
The expense tracker app allows users to record and categorize their expenses, storing details like amount, description, and category. It features a backend with Node.js and MySQL for data management, and a frontend for user interaction.

![Screenshot 2024-11-13 131537](https://github.com/user-attachments/assets/b9c742d9-608e-4c6d-8e64-85671b9900fa)
![Screenshot 2024-11-13 130431](https://github.com/user-attachments/assets/7d594285-b96c-469c-b95c-52327db746fe)
![Screenshot 2024-11-13 130555](https://github.com/user-attachments/assets/777b95fa-386e-4546-865c-1218d77ba788)
![Screenshot 2024-11-13 130819](https://github.com/user-attachments/assets/b9fe3c50-f4cb-4b6f-8192-bbba8b669ed7)
![Screenshot 2024-11-13 131656](https://github.com/user-attachments/assets/a0a7c9d4-b146-4fc8-bdc2-a5043b2697e3)
![Screenshot 2024-11-13 131746](https://github.com/user-attachments/assets/162bb44f-0f46-474b-8145-32b3cacc20ea)
![Screenshot 2024-11-13 131909](https://github.com/user-attachments/assets/b80c4159-3061-4e1e-a240-32799f8357ad)
![Screenshot 2024-11-13 132002](https://github.com/user-attachments/assets/fc37380a-a534-4db2-9c9b-fbd775356ea9)
![Screenshot 2024-11-13 132022](https://github.com/user-attachments/assets/8a52a83b-2016-4a14-8cae-dfa660e7f87a)

## :open_book: things i learned 
1. Implementing the MVC (Model-View-Controller) pattern
1. Creating dynamic routes
1. Using JWT for authentication
1. Integrating the Razorpay payment method
1. Integrating Brevo email service for password recovery
1. Hashing passwords with bcrypt
1. Working with Mongoose ORM
1. How important pagination is 
1. Implementing transactions to maintain consistency in the database
1. Utilized AWS S3 for file storage

### architecture diagram
![Screenshot 2024-11-13 004432](https://github.com/user-attachments/assets/0d372b73-104f-49b2-a270-8cd66ce55a08)

## :hammer_and_wrench: how to run
### Prerequisites
1. **Node version 18.x.x**
1. **generate JWT secret key**
1. **setup MongoDB Atlas**
1. **create razorpay account**
1. **create Brevo SMPT account**
1. **create AWS account and get s3**

### Cloning the repository
```shell
git clone https://github.com/Vishal101022/full_stack_expense_app.git
```
### Setup .env file
```js
JWT_SECRET = 
MONGODB_URI = 
PORT = 
RAZORPAY_KEY_ID = 
RAZORPAY_KEY_SECRET = 
SMPT_API_KEY = 
AWS_BUCKET_NAME = 
AWS_ACCESS_KEY = 
AWS_SECRET_ACCESS_KEY = 
```
### Install packages

```shell
npm i
```
### Start the app

```shell
npm start
```

