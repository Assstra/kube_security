# 🔒 Kubernetes Security: Use Falco, Kyverno & Istio to enhance kubernetes cluster safety

## Pre-requisites
- [**Helm**](https://helm.sh/docs/intro/install/)
- [**Kubectl**](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## 🚀 Install K3D
**Install it with the following command:**
```bash
wget -q -O - https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

**And create a new cluster:**
```bash
k3d cluster create k8s-security
```

## 🛠️ Setup Istio

Istio is a service mesh that provides a way to control how microservices share data with one another. It provides a way to secure, connect, and monitor microservices. To do so, it uses a sidecar proxy for each service instance.

**Get the Istio Helm repository:**
```bash
helm repo add istio https://istio-release.storage.googleapis.com/charts
```

**Install CRDs & daemon:**
```bash
helm install istio-base istio/base -n istio-system --set defaultRevision=default --create-namespace
helm install istiod istio/istiod -n istio-system --wait
```

**Create and update namespace istio:**
```bash
kubectl create namespace app
kubectl label namespace app istio-injection=enabled --overwrite
```

**Enforce mutual TLS between services:**
```bash
kubectl apply -f istio/peer-auth.yml
```

## 🧩 Setup Sample App

**Deploy the sample app:**
```bash
helm install sample-app ./sample_app/helm -n app
```

> 📝 **Note**: You may need to port-forward the service to access it. To do so, run the following command:
```bash
kubectl port-forward svc/sample-app-aggregator 3000:80 -n app
```

## 🛡️ Setup Falco

**Add the Falco Helm repository and install Falco:**
```bash
helm repo add falcosecurity https://falcosecurity.github.io/charts

helm install falco falcosecurity/falco --create-namespace --namespace falco
```

Change the [**values.yml**](falco/values.yml) file to use the Discord webhook URL you want and upgrade the Falco deployment:
```bash
helm upgrade falco falcosecurity/falco -f falco/values.yml -n falco
```

> 📝 **Note**: You can test this by running `kubectl exec -it sample-app-<pod-id> -- /bin/bash` and checking either for Falco logs or the Discord channel. To check Falco logs, use the following command:
```bash
kubectl logs -n falco -l app=falco
```

## 🔐 Setup Kyverno

### Install Kyverno
```bash
kubectl create -f https://github.com/kyverno/kyverno/releases/download/v1.13.0/install.yaml
```

### Test policies

This documentation describes each policy in the `kyverno_policies` directory and explains how to test them.

1. **Add Istio Injection label**: This policy adds the `istio-injection=enabled` label to all newly created namespaces to enable Istio sidecar injection.
2. **Enforce resource limit**: This policy enforces resource limits on all pods in the `app` namespace.
3. **Restrict pod creation**: This policy restricts the creation of pods in the `kyverno` and `falco` namespaces.
4. **Set image pull policy to "IfNotPresent"**: This policy sets the image pull policy to `IfNotPresent` for all newly created pods.
5. **Validate label name**: This policy validates the name of the labels in the `app` namespace. It checks if the label name is in the format `<namespace>_<image>_*`.

To test them, first apply a policy:
```bash
kubectl apply -f kyverno_policies/<policy_name>
```

Then, try to apply manifests in the [kyverno_tests](kyverno_tests) directory:
```bash
kubectl apply -f kyverno_tests/<test_policy_name>
```
