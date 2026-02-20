typedef struct Node {
    int data;
    struct Node *next;
} Node;

int main() {
    Node *head = NULL;

    head = (Node*)malloc(sizeof(Node));
    head->data = 10;
    head->next = NULL;

    printf("Node value: %d\n", head->data);

    free(head); // free memory
    return 0;
}