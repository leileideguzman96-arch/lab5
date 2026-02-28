<template>
  <div class="container">
    <h1>Mood Check-in</h1>

    <!-- Input Section -->
    <div class="card form-card">
      <input
        v-model="name"
        placeholder="Your name"
        :disabled="loading"
        class="input-field"
      />
      <textarea
        v-model="mood"
        placeholder="How are you feeling today?"
        :disabled="loading"
        class="input-field"
      ></textarea>
      <div class="btn-group">
        <button
          @click="submitMood"
          :disabled="loading || !name || !mood"
          class="btn submit-btn"
        >
          <span v-if="loading">Procsssing...</span>
          <span v-else>Submit</span>
        </button>
      </div>

      <!-- Error/AI Response Section -->
      <p v-if="error" class="error-msg">{{ error }}</p>
      <div v-if="aiMessage" class="ai-box">
        <strong>AI Advisor:</strong> {{ aiMessage }}
      </div>
    </div>

    <!-- Mood History List -->
    <div class="card history-card">
      <div class="history-header">
        <h3>Mood History</h3>
        <button @click="fetchHistory" class="btn refresh-btn">Refresh</button>
      </div>
      <table v-if="history.length > 0" class="history-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mood</th>
            <th>AI Response</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in history" :key="entry.id">
            <td>{{ entry.full_name }}</td>
            <td>{{ entry.mood_text }}</td>
            <td>{{ entry.ai_message }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No history found.</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      name: '',
      mood: '',
      aiMessage: '',
      loading: false,
      error: null,
      history: []
    };
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    async submitMood() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/api/moods', {
          full_name: this.name,
          mood_text: this.mood
        });

        this.aiMessage = res.data.ai_message || res.data.aiMessage;
        this.mood = '';
        this.fetchHistory();
      } catch (err) {
        this.error = "Failed to connect to server. Is the backend running?";
      } finally {
        this.loading = false;
      }
    },
    async fetchHistory() {
      try {
        const res = await api.get('/api/moods');
        this.history = res.data;
      } catch (err) {
        console.error("Could not fetch history");
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 30px auto;
  font-family: 'Segoe UI', sans-serif;
  color: #000;
  background: #fff;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #000;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  font-size: 14px;
  background: #fff;
  color: #000;
  resize: none;
}

textarea.input-field {
  min-height: 80px;
}

.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 15px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.submit-btn {
  background-color: #000;
  color: #fff;
}

.submit-btn:hover:not(:disabled) {
  background-color: #333;
}

.refresh-btn {
  background: #000;
  color: #fff;
}

.refresh-btn:hover {
  background: #333;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-box {
  background: #f2f2f2;
  padding: 15px;
  border-left: 5px solid #000;
  margin-top: 12px;
  border-radius: 6px;
  color: #000;
}

.error-msg {
  color: #b00020;
  font-weight: bold;
  margin-top: 5px;
}

.history-card .history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  border: 1px solid #aaa;
  padding: 10px;
  text-align: left;
  color: #000;
}

.history-table th {
  background-color: #e0e0e0;
}
</style>