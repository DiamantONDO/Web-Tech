#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

int main() {
    Node *head = NULL;

    // First node
    head = (Node*)malloc(sizeof(Node));
    head->data = 10;
    head->next = NULL;

    // Create new node to insert at end
    Node *newNode = (Node*)malloc(sizeof(Node));
    newNode->data = 20;
    newNode->next = NULL;

    // Traverse to last node
    Node *temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }

    // Attach new node at the end
    temp->next = newNode;

    // Print the list
    temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");

    // Free memory
    free(newNode);
    free(head);

    return 0;
}
