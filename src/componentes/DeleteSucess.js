import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export const DeleteSuccessModal = ({ visible, onClose, navigation, confirmText = 'Voltar' }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, styles.successBorder]}>
          <Text style={styles.successTitle}>Sucesso!</Text>
          <Text style={styles.message}>
            Sala excluída com sucesso. Você será redirecionado.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={() => {
              onClose && onClose(); // fecha o modal se necessário
              navigation.goBack(); // redireciona
            }}
          >
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  successBorder: {
    borderWidth: 2,
    borderColor: '#4BB543',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#4BB543',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  successButton: {
    backgroundColor: '#4BB543',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
