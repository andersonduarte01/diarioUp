import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const SuccessModal = ({ visible, message, onClose, confirmText = 'Ok' }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, styles.successBorder]}>
          <Text style={styles.successTitle}>Sucesso</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={[styles.button, styles.successButton]} onPress={onClose}>
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ErrorModal = ({ visible, message, onClose, confirmText = 'Ok' }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, styles.errorBorder]}>
          <Text style={styles.errorTitle}>Erro</Text>
          <Text style={styles.messageerror}>{message}</Text>
          <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={onClose}>
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  successBorder: {
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  messageerror: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 24,
    textAlign: 'center',
  },  
  button: {
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  successButton: {
    backgroundColor: '#007AFF',
  },
  errorButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
