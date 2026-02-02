Here is a Python code block:

```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 numbers
print([fibonacci(i) for i in range(10)])
```