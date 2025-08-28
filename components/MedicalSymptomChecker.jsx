import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import symptomModuleMap from '../data/symptomModules';

export default function CheckSymptoms({ route }) {
  const { selectedSymptoms } = route.params;
  const [symptomIndex, setSymptomIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  const currentSymptom = selectedSymptoms[symptomIndex];
  const symptomModule = symptomModuleMap[currentSymptom];

  useEffect(() => {
    if (symptomModule?.questions?.length > 0) {
      setQuestions(symptomModule.questions);
    } else {
      setQuestions([]);
    }
  }, [symptomModule]);

  const handleAnswer = (option) => {
    const currentQuestion = questions[questionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option
    }));

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else if (symptomIndex < selectedSymptoms.length - 1) {
      setSymptomIndex((prev) => prev + 1);
      setQuestionIndex(0);
      setAnswers({});
    } else {
      // End of questions for all symptoms
      console.log('All answers:', answers);
      // You could navigate to a results screen here
    }
  };

  if (!symptomModule) {
    return (
      <View style={styles.center}>
        <Text>No data available for {currentSymptom}</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No questions found for {currentSymptom}</Text>
      </View>
    );
  }

  const currentQuestion = questions[questionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{currentSymptom}</Text>
      <Text style={styles.questionCounter}>
        Question {questionIndex + 1} of {questions.length}
      </Text>
      <Text style={styles.questionText}>{currentQuestion.text}</Text>
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  },
  questionCounter: {
    fontSize: 16,
    marginBottom: 8
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16
  },
  optionButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  optionText: {
    fontSize: 16
  }
});
