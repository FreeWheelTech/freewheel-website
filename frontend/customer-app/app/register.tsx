import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';

export default function RegisterScreen() {
  const { register } = useAuth();
  const theme = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined });
    } catch (e: any) {
      let message = e.message || 'Could not register';
      if (e.response?.data?.message) {
        message = e.response.data.message;
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      }
      Alert.alert('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerContainer}>
            <Text style={[styles.logo, { color: theme.text }]}>BYTE</Text>
            <Text style={[styles.logoSub, { color: theme.primary }]}>— C A F E —</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>CODE • EAT • REPEAT</Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Create Your Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join Byte Cafe and start your coffee journey</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Phone Number (Optional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
            
            <View style={styles.passwordHintContainer}>
              <Text style={[styles.passwordHintText, { color: password.length >= 8 ? theme.success : theme.textSecondary }]}>
                {password.length >= 8 ? '✓' : '○'} Min 8 characters
              </Text>
            </View>

            <Button 
              title="Create Account" 
              onPress={handleRegister} 
              isLoading={isLoading} 
              style={styles.loginBtn} 
            />

            <View style={styles.orContainer}>
              <View style={[styles.orLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.orText, { color: theme.textSecondary }]}>or continue with</Text>
              <View style={[styles.orLine, { backgroundColor: theme.border }]} />
            </View>

            <View style={styles.socialContainer}>
              <Button 
                title="Google" 
                variant="secondary" 
                style={styles.socialBtn} 
                textStyle={{ color: theme.text }}
              />
              <Button 
                title="Apple" 
                variant="secondary" 
                style={styles.socialBtn} 
                textStyle={{ color: theme.text }}
              />
            </View>

            <View style={styles.footerContainer}>
              <Text style={{ color: theme.textSecondary }}>Already have an account? </Text>
              <Link href={"/login" as any}>
                <Text style={{ color: theme.accent, fontWeight: 'bold' }}>Login</Text>
              </Link>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 24,
    paddingVertical: 40 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginTop: -5,
  },
  tagline: {
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '600'
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
  },
  passwordHintContainer: {
    marginBottom: 24,
    marginTop: -8,
  },
  passwordHintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loginBtn: {
    marginBottom: 24,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
