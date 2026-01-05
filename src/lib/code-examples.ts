import { MigrationPath } from '@/types/migration';

interface CodeExample {
  original: string;
  converted: string;
  language: string;
  convertedLanguage: string;
}

export const codeExamples: Record<MigrationPath, CodeExample> = {
  'jquery-react': {
    language: 'javascript',
    convertedLanguage: 'typescript',
    original: `// jQuery Code
$(document).ready(function() {
  var count = 0;
  
  $('#counter').text(count);
  
  $('#increment').click(function() {
    count++;
    $('#counter').text(count);
    $('#counter').addClass('highlight');
  });
  
  $('#decrement').click(function() {
    count--;
    $('#counter').text(count);
  });
  
  $.ajax({
    url: '/api/data',
    method: 'GET',
    success: function(data) {
      $('#result').html(data.message);
    },
    error: function(err) {
      console.log('Error:', err);
    }
  });
});`,
    converted: `// React Hooks Code
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [result, setResult] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setResult(data.message);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchData();
  }, []);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setIsHighlighted(true);
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
  };

  return (
    <div>
      <span 
        id="counter" 
        className={isHighlighted ? 'highlight' : ''}
      >
        {count}
      </span>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
      <div id="result">{result}</div>
    </div>
  );
}

export default Counter;`,
  },
  'jquery-vue': {
    language: 'javascript',
    convertedLanguage: 'vue',
    original: `// jQuery Code
$(document).ready(function() {
  var items = [];
  
  $('#add-item').click(function() {
    var newItem = $('#item-input').val();
    items.push(newItem);
    renderList();
  });
  
  function renderList() {
    var html = '';
    $.each(items, function(index, item) {
      html += '<li>' + item + '</li>';
    });
    $('#item-list').html(html);
  }
});`,
    converted: `<script setup>
import { ref } from 'vue';

const items = ref([]);
const newItem = ref('');

const addItem = () => {
  if (newItem.value.trim()) {
    items.value.push(newItem.value);
    newItem.value = '';
  }
};
</script>

<template>
  <div>
    <input v-model="newItem" placeholder="Enter item" />
    <button @click="addItem">Add Item</button>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>`,
  },
  'python2-python3': {
    language: 'python',
    convertedLanguage: 'python',
    original: `# Python 2 Code
print "Hello, World!"
print "Value:", 42

# Dictionary methods
user = {"name": "John", "age": 30}
for key, value in user.iteritems():
    print key, value

# Range and xrange
for i in xrange(10):
    print i

# Division
result = 5 / 2  # Returns 2 in Python 2

# Unicode strings
name = u"Müller"

# Exception handling
try:
    raise ValueError, "An error occurred"
except ValueError, e:
    print e

# Raw input
user_input = raw_input("Enter name: ")`,
    converted: `# Python 3 Code
print("Hello, World!")
print("Value:", 42)

# Dictionary methods
user = {"name": "John", "age": 30}
for key, value in user.items():
    print(key, value)

# Range (xrange removed)
for i in range(10):
    print(i)

# Division (true division by default)
result = 5 // 2  # Integer division
result_float = 5 / 2  # Returns 2.5

# Unicode strings (default in Python 3)
name = "Müller"

# Exception handling
try:
    raise ValueError("An error occurred")
except ValueError as e:
    print(e)

# Input (raw_input renamed)
user_input = input("Enter name: ")`,
  },
  'angularjs-angular': {
    language: 'javascript',
    convertedLanguage: 'typescript',
    original: `// AngularJS Controller
angular.module('myApp', [])
  .controller('UserController', function($scope, $http) {
    $scope.users = [];
    $scope.loading = true;
    
    $scope.loadUsers = function() {
      $http.get('/api/users')
        .then(function(response) {
          $scope.users = response.data;
          $scope.loading = false;
        })
        .catch(function(error) {
          console.error('Error:', error);
          $scope.loading = false;
        });
    };
    
    $scope.deleteUser = function(userId) {
      $http.delete('/api/users/' + userId)
        .then(function() {
          $scope.loadUsers();
        });
    };
    
    $scope.loadUsers();
  });`,
    converted: `// Angular Component
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-list',
  template: \`
    <div *ngIf="loading">Loading...</div>
    <ul *ngIf="!loading">
      <li *ngFor="let user of users">
        {{ user.name }}
        <button (click)="deleteUser(user.id)">Delete</button>
      </li>
    </ul>
  \`
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  deleteUser(userId: number): void {
    this.http.delete(\`/api/users/\${userId}\`).subscribe({
      next: () => this.loadUsers()
    });
  }
}`,
  },
  'es5-es6': {
    language: 'javascript',
    convertedLanguage: 'typescript',
    original: `// ES5 Code
var API_URL = 'https://api.example.com';

function fetchUsers(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', API_URL + '/users');
  xhr.onload = function() {
    if (xhr.status === 200) {
      callback(null, JSON.parse(xhr.responseText));
    } else {
      callback(new Error('Request failed'));
    }
  };
  xhr.onerror = function() {
    callback(new Error('Network error'));
  };
  xhr.send();
}

function processUsers(users) {
  var activeUsers = users.filter(function(user) {
    return user.active === true;
  });
  
  var userNames = activeUsers.map(function(user) {
    return user.firstName + ' ' + user.lastName;
  });
  
  return userNames;
}

fetchUsers(function(err, users) {
  if (err) {
    console.log('Error:', err);
    return;
  }
  var names = processUsers(users);
  console.log('Active users:', names);
});`,
    converted: `// ES6+ / TypeScript Code
const API_URL = 'https://api.example.com';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  active: boolean;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(\`\${API_URL}/users\`);
  
  if (!response.ok) {
    throw new Error('Request failed');
  }
  
  return response.json();
};

const processUsers = (users: User[]): string[] => {
  const activeUsers = users.filter(user => user.active);
  
  const userNames = activeUsers.map(
    ({ firstName, lastName }) => \`\${firstName} \${lastName}\`
  );
  
  return userNames;
};

// Using async/await
const main = async () => {
  try {
    const users = await fetchUsers();
    const names = processUsers(users);
    console.log('Active users:', names);
  } catch (err) {
    console.error('Error:', err);
  }
};

main();`,
  },
  'react-class-hooks': {
    language: 'typescript',
    convertedLanguage: 'typescript',
    original: `// React Class Component
import React, { Component } from 'react';

interface Props {
  initialCount: number;
}

interface State {
  count: number;
  isLoading: boolean;
  data: string | null;
}

class Counter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      count: props.initialCount,
      isLoading: true,
      data: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.count !== this.state.count) {
      console.log('Count changed:', this.state.count);
    }
  }

  componentWillUnmount() {
    console.log('Component unmounting');
  }

  fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    this.setState({ data: data.message, isLoading: false });
  };

  increment = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  render() {
    const { count, isLoading, data } = this.state;
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
      <div>
        <p>Count: {count}</p>
        <p>Data: {data}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;`,
    converted: `// React Hooks Component
import { useState, useEffect, useCallback } from 'react';

interface Props {
  initialCount: number;
}

function Counter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<string | null>(null);

  // componentDidMount equivalent
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result.message);
      setIsLoading(false);
    };
    
    fetchData();
    
    // componentWillUnmount equivalent
    return () => {
      console.log('Component unmounting');
    };
  }, []);

  // componentDidUpdate equivalent for count
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Count: {count}</p>
      <p>Data: {data}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;`,
  },
};
