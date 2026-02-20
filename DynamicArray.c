#include <stdio.h>
#include <stdlib.h>

int main (){
    int arr[] = {2,5, 8, 3, 9, 7, 1};

    size_t size = sizeof(arr) / sizeof(arr[0]);

    int newArr = 5;
    int newSize = size + 1;
    int *dynamicArr = (int*)malloc(newSize * sizeof(int));
    
    size_t dynamic_size = sizeof(dynamicArr);
    int i = 0;
    while(i < dynamic_size) {
        if(size > i) {
            dynamicArr[i] = arr[i];
        }else {
            dynamicArr[i] = newArr;
        }
        i++;
    }

    for(int i = 0; i < dynamic_size; i++) {
        printf("%d ", dynamicArr[i]);
    }
    printf("\n");


    free(dynamicArr);

}

