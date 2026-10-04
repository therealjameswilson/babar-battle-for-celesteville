import UIKit
import WebKit

/// The engine and all artwork ship in the binary. No website or remote-code dependency.
final class GameViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
    private var webView: WKWebView!
    private let page: String
    private let archive: Bool
    private var clientRoot: URL { Bundle.main.url(forResource: "Client", withExtension: nil)! }
    init(page: String = "index.html", archive: Bool = false) {
        self.page = page; self.archive = archive
        super.init(nibName: nil, bundle: nil)
    }
    required init?(coder: NSCoder) { fatalError("Use programmatic initialization") }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .allButUpsideDown }
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 244/255, green: 236/255, blue: 212/255, alpha: 1)
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.allowsInlineMediaPlayback = true
        // Retain gesture-started audio. Native lifecycle pauses the same game rules.
        configuration.userContentController.addUserScript(WKUserScript(source: """
            const install = document.querySelector('.app-install');
            if (install) install.innerHTML = '<h3>iPhone app</h3><p>The complete game is included. No connection is required to play. Saves stay on this device; deleting the app removes them.</p><p><a href="native-privacy.html" target="_blank">Privacy policy</a></p>';
            """, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = view.backgroundColor
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor)
        ])
        if archive {
            title = page == "characters.html" ? "Character archive" : "Privacy"
            navigationItem.rightBarButtonItem = UIBarButtonItem(systemItem: .done, primaryAction: UIAction { [weak self] _ in self?.dismiss(animated: true) })
        }
        loadGame()
    }
    private func loadGame() {
        webView.loadFileURL(clientRoot.appendingPathComponent(page), allowingReadAccessTo: clientRoot)
    }
    func saveAndPause() {
        guard !archive, isViewLoaded else { return }
        webView.evaluateJavaScript("""
            if (typeof saveBattle === 'function') saveBattle(true);
            if (typeof running !== 'undefined' && running && !ended && !paused) {
                togglePause();
                if (typeof updatePresentation === 'function') updatePresentation();
            }
            """, completionHandler: nil)
    }
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
        if url.isFileURL && url.standardizedFileURL.path.hasPrefix(clientRoot.standardizedFileURL.path + "/") {
            decisionHandler(.allow); return
        }
        if navigationAction.navigationType == .linkActivated && url.scheme == "https" {
            UIApplication.shared.open(url)
        }
        decisionHandler(.cancel)
    }
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let page = navigationAction.request.url?.lastPathComponent, ["characters.html", "native-privacy.html"].contains(page) {
            saveAndPause()
            let controller = UINavigationController(rootViewController: GameViewController(page: page, archive: true))
            present(controller, animated: true)
        }
        return nil
    }
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        showRecovery("The game was stopped by iOS. Reopen it and choose Continue to restore the latest local checkpoint.")
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        showRecovery("The bundled game could not open. Try reopening it.")
    }
    private func showRecovery(_ message: String) {
        guard presentedViewController == nil else { return }
        let alert = UIAlertController(title: "Return to Celesteville", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Reopen game", style: .default) { [weak self] _ in self?.loadGame() })
        present(alert, animated: true)
    }
}
