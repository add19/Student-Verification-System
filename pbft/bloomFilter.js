const SHA256 = require("sha256");

class BloomFilter{
    constructor(){
        this.array = Array(51).fill(0);
    }
    hash(string){
        for(var i=0;i<4; i++){
            // console.log(parseInt(SHA256(i.toString() + string), 16)%51);
            this.array[parseInt(SHA256(i.toString() + string), 16)%51] = 1;
        }
    }
    printFilter(){
        for(var i=0;i<=50; i++){
            console.log(this.array[i]);
        }
    }
    static checkFilter(bloomfilterArr1, bloomfilterArr2){
        for(var i=0; i<=50; i++){
            if(bloomfilterArr1[i] == 1 && bloomfilterArr2[i] != 1){
                console.log("Not present in this set");
                return false;
            }
        }
        console.log("The element might be present in the filter...");
        return true;
    }
    getFilter(){
        return this.array;
    }
    clearFilter(){
        this.array.fill(0);
    }
}

// var bf = new BloomFilter();
// bf.hash("9c5577e30e355271ddae0c39319a7791cbe855c2d9ded6724ca0a3c3e9ea4a1c");
// bf.hash("71e9e1a4d1c2da4c6df06eca46d9f36a3eed82a18fe357cc26c2d4a9d881bb34");
// bf.hash("df17c837091bbd1c9a11233761af7f16ba891933ad29a43de36d544832c9b7ce");

// var cbf = new BloomFilter();
// cbf.hash("df17c837091bbd1c9a11233761af7f16ba891933ad29a43de36d544832c9b7cf");
// var filterToVerify = cbf.getFilter();
// bf.checkFilter(filterToVerify);
// bf.clearFilter();
// cbf.clearFilter();

module.exports = BloomFilter;