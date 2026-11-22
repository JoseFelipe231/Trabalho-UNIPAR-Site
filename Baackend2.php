<?php
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método não permitido.');
}

$origem = trim($_POST['origem'] ?? '');
$destino = trim($_POST['destino'] ?? '');
$transportadora = trim($_POST['transportadora'] ?? '');
$status = trim($_POST['status'] ?? 'Aguardando Coleta');

// Arrays vindos dos inputs dinâmicos: name="produto_nome[]", etc.
$nomes = $_POST['produto_nome'] ?? [];
$qtds = $_POST['produto_qtd'] ?? [];
$pesos = $_POST['produto_peso'] ?? [];

if ($origem === '' || $destino === '' || $transportadora === '') {
    http_response_code(400);
    exit('Preencha origem, destino e transportadora.');
}

if (
    !is_array($nomes) || !is_array($qtds) || !is_array($pesos) ||
    count($nomes) === 0 || count($nomes) !== count($qtds) || count($nomes) !== count($pesos)
) {
    http_response_code(400);
    exit('Adicione ao menos um produto válido.');
}

try {
    $pdo->beginTransaction();

    // 1. Insere o registro principal do frete
    $sqlFrete = 'INSERT INTO fretes (origem, destino, transportadora, status_frete)
                 VALUES (:origem, :destino, :transportadora, :status)';
    $stmtFrete = $pdo->prepare($sqlFrete);
    $stmtFrete->execute([
        ':origem' => $origem,
        ':destino' => $destino,
        ':transportadora' => $transportadora,
        ':status' => $status,
    ]);

    $freteId = (int) $pdo->lastInsertId();

    // 2. Insere cada produto dinâmico vinculado a frete_id
    $sqlItem = 'INSERT INTO frete_itens (frete_id, produto_nome, quantidade, peso_unitario)
                VALUES (:frete_id, :produto_nome, :quantidade, :peso_unitario)';
    $stmtItem = $pdo->prepare($sqlItem);

    for ($i = 0; $i < count($nomes); $i++) {
        $nomeItem = trim((string) $nomes[$i]);
        $qtdItem = filter_var($qtds[$i], FILTER_VALIDATE_INT);
        $pesoItem = filter_var($pesos[$i], FILTER_VALIDATE_FLOAT);

        if ($nomeItem === '' || $qtdItem === false || $qtdItem < 1 || $pesoItem === false || $pesoItem <= 0) {
            throw new InvalidArgumentException("Dados inválidos no item #" . ($i + 1));
        }

        $stmtItem->execute([
            ':frete_id' => $freteId,
            ':produto_nome' => $nomeItem,
            ':quantidade' => $qtdItem,
            ':peso_unitario' => $pesoItem,
        ]);
    }

    $pdo->commit();

    // Redireciona de volta para a página principal (ou retorna JSON se usar fetch)
    header('Location: index.php?salvo=1');
    exit;

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo 'Erro ao registrar frete: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
}