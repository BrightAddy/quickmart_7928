import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Camera as CameraIcon, X, Check, AlertCircle, RefreshCw } from 'lucide-react-native';
import Button from './Button';
import Colors from '@/constants/colors';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (selfieImage: string) => Promise<boolean>;
}

export default function VerificationModal({ visible, onClose, onVerify }: VerificationModalProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [permission, requestPermission] = useCameraPermissions();
  
  React.useEffect(() => {
    if (visible) {
      if (permission) {
        setHasPermission(permission.granted);
      } else {
        requestPermission();
      }
      setCapturedImage(null);
      setError(null);
    }
  }, [visible, permission]);
  
  React.useEffect(() => {
    if (permission) {
      setHasPermission(permission.granted);
      
      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Required",
          "We need camera permission to verify your identity. Please enable it in your device settings.",
          [{ text: "OK", onPress: onClose }]
        );
      }
    }
  }, [permission]);
  
  const takePicture = async () => {
    if (Platform.OS === 'web') {
      // For web, we'll use a mock image since camera capture isn't fully supported
      setCapturedImage('https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop');
      return;
    }
    
    try {
      // In Expo SDK 52, we need to use a different approach since we're using CameraView
      // This is a mock implementation - in a real app, you'd use the actual capture method
      // For now, we'll simulate a capture with a timeout
      setIsVerifying(true);
      
      // Simulate capture delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use a sample image for demo purposes
      setCapturedImage('https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop');
      setIsVerifying(false);
    } catch (err) {
      console.error('Error taking picture:', err);
      setError('Failed to capture image. Please try again.');
      setIsVerifying(false);
    }
  };
  
  const handleVerify = async () => {
    if (!capturedImage) return;
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const success = await onVerify(capturedImage);
      
      if (success) {
        Alert.alert(
          "Verification Successful",
          "Your identity has been verified. You can now accept orders.",
          [{ text: "OK", onPress: onClose }]
        );
      } else {
        setError('Verification failed. Please try again with a clearer photo.');
        setCapturedImage(null);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const retakePicture = () => {
    setCapturedImage(null);
    setError(null);
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Identity Verification</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {!hasPermission ? (
            <View style={styles.permissionContainer}>
              <CameraIcon size={64} color={Colors.primary} />
              <Text style={styles.permissionText}>
                Camera permission is required for identity verification
              </Text>
              <Button 
                title="Grant Permission" 
                onPress={requestPermission} 
                style={styles.permissionButton}
              />
            </View>
          ) : capturedImage ? (
            <View style={styles.previewContainer}>
              <Image 
                source={{ uri: capturedImage }} 
                style={styles.previewImage} 
              />
              
              {error ? (
                <View style={styles.errorContainer}>
                  <AlertCircle size={20} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.actionButtons}>
                <Button
                  title="Retake"
                  onPress={retakePicture}
                  variant="outline"
                  style={styles.actionButton}
                  icon={<RefreshCw size={20} color={Colors.primary} />}
                />
                
                <Button
                  title="Verify"
                  onPress={handleVerify}
                  style={styles.actionButton}
                  isLoading={isVerifying}
                  icon={<Check size={20} color={Colors.white} />}
                />
              </View>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Take a Selfie</Text>
                <Text style={styles.instructionsText}>
                  Please ensure your face is clearly visible and well-lit
                </Text>
              </View>
              
              {Platform.OS === 'web' ? (
                <View style={styles.webCameraPlaceholder}>
                  <CameraView
                    style={styles.camera}
                    facing={cameraType}
                  />
                </View>
              ) : (
                <CameraView
                  style={styles.camera}
                  facing={cameraType}
                />
              )}
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    width: '80%',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  instructionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
  camera: {
    width: '100%',
    height: 400,
  },
  webCameraPlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.error,
  },
});