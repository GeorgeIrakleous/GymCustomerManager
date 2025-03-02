// OverlayProvider.js
import React, { createContext, useState, useContext } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import CheckMarkAnimation from './CheckMarkAnimation';

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const showCheckMark = () => setVisible(true);
  const hideCheckMark = () => setVisible(false);

  return (
    <OverlayContext.Provider value={{ showCheckMark, hideCheckMark }}>
      {children}
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalContainer}>
          <CheckMarkAnimation visible={true} />
        </View>
      </Modal>
    </OverlayContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)', // transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const useOverlay = () => useContext(OverlayContext);
