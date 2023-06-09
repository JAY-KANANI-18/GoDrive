array1 = [1,2,3,4,5,6]

for (let i = 0; i < array1.length; i++) {

    const element = array1[i];
    if(i===0){
        array1.push(5)
    }
    

    console.log(element);
    
}