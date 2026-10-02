import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCreateTodo, useTodos, useToggleTodo } from '../features/todos/hooks';

export function TodosScreen() {
  const [title, setTitle] = useState('');
  const todosQuery = useTodos();
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();
  const mutationError = createTodo.error ?? toggleTodo.error;

  function addTodo() {
    createTodo.mutate(
      { title },
      {
        onSuccess: () => setTitle(''),
      },
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>CQRS EXAMPLE</Text>
        <Text style={styles.heading}>Todos</Text>
        <Text style={styles.subtitle}>
          Commands change state. Queries read the validated result.
        </Text>

        <View style={styles.form}>
          <TextInput
            accessibilityLabel="New todo"
            onChangeText={setTitle}
            onSubmitEditing={addTodo}
            placeholder="What needs doing?"
            returnKeyType="done"
            style={styles.input}
            value={title}
          />
          <Pressable
            accessibilityRole="button"
            disabled={createTodo.isPending}
            onPress={addTodo}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
              createTodo.isPending && styles.disabled,
            ]}
          >
            <Text style={styles.addButtonText}>
              {createTodo.isPending ? 'Adding…' : 'Add'}
            </Text>
          </Pressable>
        </View>

        {mutationError ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {mutationError.message}
          </Text>
        ) : null}
        {todosQuery.isError ? (
          <Text accessibilityRole="alert" style={styles.error}>
            Could not load todos: {todosQuery.error.message}
          </Text>
        ) : null}

        {todosQuery.isPending ? (
          <ActivityIndicator color="#2563eb" style={styles.loader} />
        ) : todosQuery.data?.length ? (
          <View style={styles.list}>
            {todosQuery.data.map((todo) => (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: todo.completed }}
                key={todo.id}
                onPress={() => toggleTodo.mutate({ id: todo.id })}
                style={({ pressed }) => [
                  styles.todo,
                  pressed && styles.pressed,
                  todo.completed && styles.completedTodo,
                ]}
              >
                <View style={[styles.checkbox, todo.completed && styles.checked]}>
                  {todo.completed ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={[styles.todoTitle, todo.completed && styles.completedTitle]}>
                  {todo.title}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Your list is clear. Add a todo to get started.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  heading: {
    color: '#0f172a',
    fontSize: 36,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  form: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 28,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 10,
    borderWidth: 1,
    color: '#0f172a',
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    minWidth: 76,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    color: '#b91c1c',
    lineHeight: 20,
    marginTop: 14,
  },
  loader: {
    marginTop: 36,
  },
  list: {
    gap: 10,
    marginTop: 24,
  },
  todo: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 14,
  },
  completedTodo: {
    backgroundColor: '#f1f5f9',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#94a3b8',
    borderRadius: 6,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginRight: 12,
    width: 22,
  },
  checked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  todoTitle: {
    color: '#0f172a',
    flex: 1,
    fontSize: 16,
  },
  completedTitle: {
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  empty: {
    color: '#64748b',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 30,
    textAlign: 'center',
  },
});
