// Array Destructuring
// Basic example
// const arr = [10, 20, 30];
// const [a, b, c] = arr;
// console.log(a); // 10
// console.log(b); // 20
// console.log(c); // 30

//rest operator--> it groups ythe remaining values

// function sum(a, ...num){
//     console.log(a);
//     console.log(num);
//     console.log(num[1]);
// }
// sum(1,2,3,4);

let obj={
    title:"lec",
    tags:"spread,rest",
    description:"hello dosto"
}

// let{title,tags,description}=obj;
// console.log(tags);

// let{title, ...remaining}=obj;
// console.log(remaining);

// function obj1(...hello){
//     console.log(hello);
// }

// destructuring inside function
// function obj1({title,tags,description}){
//     console.log(tags);
//     let tagsArray= tags.split(",");
//     console.log(tagsArray);
// } 
//obj1(obj);


// Spread Operator (...) → Expands values

// Used to expand arrays or objects into individual elements.
// let arr=[4,5,6,8];
// let arr2=[9,5,7,8,9];
// let newArr=[...arr,...arr2];
// console.log(newArr);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//forEach function-->doesnot return anything (undefiend)
// let arr =[3,6,23,57,86];

// arr.forEach(function(val){
//     console.log(val);
//     val=val+5;
//     console.log(val);
// })

// function print(val){
//     console.log(val);
// }
// arr.forEach(print);

// // Arrow function
// function hello(arr){
//      console.log(arr);
// }
// const hello = (arr)=>{
//     console.log(arr);

// }
// hello(arr);


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Map function 
